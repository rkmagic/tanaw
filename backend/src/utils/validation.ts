export const validateProfileData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (data.full_name && data.full_name.length > 200) {
    errors.push('Full name must be 200 characters or less');
  }

  if (data.mobile_number && !/^\+?[0-9]{10,15}$/.test(data.mobile_number)) {
    errors.push('Mobile number must be 10-15 digits, optionally starting with +');
  }

  if (data.birthday) {
    const birthday = new Date(data.birthday);
    const today = new Date();
    if (birthday > today) {
      errors.push('Birthday cannot be in the future');
    }
    if (birthday < new Date('1900-01-01')) {
      errors.push('Birthday must be after 1900-01-01');
    }
  }

  if (data.past_work_experience && data.past_work_experience.length > 5000) {
    errors.push('Past work experience must be 5000 characters or less');
  }

  if (data.educational_background && data.educational_background.length > 5000) {
    errors.push('Educational background must be 5000 characters or less');
  }

  if (data.desired_job && data.desired_job.length > 200) {
    errors.push('Desired job must be 200 characters or less');
  }

  if (data.desired_country && data.desired_country.length > 100) {
    errors.push('Desired country must be 100 characters or less');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
