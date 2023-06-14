#!/usr/bin/env bash
# Set up Parameter Store parameters and Secrets Manager secrets required to deploy Admin Tool stacks
cd "$(dirname "${BASH_SOURCE[0]}")"
set -eu

ACCOUNT=$(../aws.sh get-current-account-name)
PARAMETER_NAME_PREFIX=/self-service
MANUAL_PARAMETERS=(api_notification_email)

declare -A PARAMETERS=(
  [cognito_external_id]=$PARAMETER_NAME_PREFIX/cognito/external-id
  [deletion_protection]=$PARAMETER_NAME_PREFIX/config/deletion-protection-enabled
  [api_notification_email]=$PARAMETER_NAME_PREFIX/api/notification-email
)

declare -A SECRETS=(
  [auth_api_key]=$PARAMETER_NAME_PREFIX/api/auth-api-key
  [notify_api_key]=$PARAMETER_NAME_PREFIX/cognito/notify-api-key
)

function check-parameter-set {
  [[ $(xargs < <(get-parameter-value "$1")) ]]
}

function check-secret-set {
  aws secretsmanager describe-secret --secret-id "$1" &> /dev/null
}

function get-parameter-value {
  aws ssm get-parameter --name "${PARAMETERS[$1]}" --query "Parameter.Value" --output text 2> /dev/null
}

function write-parameter-value {
  echo "Setting '$1' to '$2'"
  aws ssm put-parameter --name "${PARAMETERS[$1]}" --value "$(xargs <<< "$2")" --type String --overwrite > /dev/null
}

function write-secret-value {
  echo "Setting secret '$1'"
  aws secretsmanager create-secret --name "$1" --secret-string "$(xargs <<< "$2")" > /dev/null
}

function get-value-from-user {
  local name=$1 type=${2:-parameter} value
  while [[ -z $(xargs <<< "${value:-}") ]]; do read -rp "Enter a value for the $type '$name': " value; done
  echo "$value"
}

function check-manual-parameters {
  local parameter
  for parameter in "${MANUAL_PARAMETERS[@]}"; do
    check-parameter-set "$parameter" || write-parameter-value "$parameter" "$(get-value-from-user "$parameter")"
  done
}

function check-secret {
  local secret=$1
  check-secret-set "$secret" || write-secret-value "$secret" "$(get-value-from-user "$secret" secret)"
}

function check-secrets {
  local secret
  for secret in "${SECRETS[@]}"; do check-secret "$secret"; done
}

function check-cognito-external-id {
  check-parameter-set cognito_external_id || write-parameter-value cognito_external_id "$(uuidgen)"
}

function check-deletion-protection {
  check-parameter-set deletion_protection ||
    write-parameter-value deletion_protection "$([[ $ACCOUNT == production ]] && echo ACTIVE || echo INACTIVE)"
}

function print-parameters {
  local parameter
  echo "--- Deployment parameters ---"
  for parameter in "${!PARAMETERS[@]}"; do
    echo "${PARAMETERS[$parameter]}: $(get-parameter-value "$parameter")"
  done
}

function print-secrets {
  local secret
  echo "--- Secrets ---"
  for secret in "${SECRETS[@]}"; do
    check-secret-set "$secret" && echo "$secret"
  done
}

function check-deployment-parameters {
  ../aws.sh check-current-account
  check-cognito-external-id
  check-deletion-protection
  check-manual-parameters
  check-secrets
  print-parameters
  print-secrets
}

[[ "$*" ]] || check-deployment-parameters
[[ "$*" ]] && "$@"
