export enum ErrorMessage {
  InvalidForm = 'errors.invalid-form',
  FieldShouldBeString = 'errors.field-invalid.should-be-string',
  FieldShouldBeNumber = 'errors.field-invalid.should-be-number',
  FieldShouldBeEnum = 'errors.field-invalid.should-be-enum',
  FieldShouldBeEmail = 'errors.field-invalid.should-be-email',
  FieldShouldBeArray = 'errors.field-invalid.should-be-array',
  FieldShouldBeBufferWithBits = 'errors.field-invalid.should-be-buffer-with-seven-bits',
  NotAuthorizedRequest = 'errors.not-authorized.request',
  InvalidStatus_UserInactive = 'errors.invalid-status.user-inactive',
  NotExists_User = 'errors.auth.not-exists.user',
  UserWithEmailExists = 'errors.auth.user-already-exists',
  UserCreationFailed = 'errors.auth.user-creation-failed',
  ExitNotExecuted = 'errors.auth.exit-not-executed',
  InvalidDate = 'errors.invalid-date',
  RecordNotFound = 'errors.record.not-found',
  RecordAlreadyExist = 'errors.record-already-exist',
  RecordCreationFailed = 'errors.record-creation-failed',
  RecordUpdationFailed = 'errors.record-updation-failed',
  RecordDeletionFailed = 'errors.record-deletion-failed',
  NotExists_Record = 'errors.not-exists-record',
  UserNotExists = 'errors.not-exist-user',
  UserAlreadyExists = 'errors.user-already-exists',
  RecordNotExists = 'errors.not-exist-record',
  BadResetToken = 'errors.bad-reset-token',
  BadVerification = 'errors.verification-failed',
  NotAuthorizedDevice = 'errors.bad-device',
  BadPassword = 'errors.passwords-dont-match',
  FailedToSendMessage='errors.failed-to-send-message',
  NotEnoughAvailableSeats = 'errors.not-enough-available-seats',
}
