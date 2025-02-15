export interface RegisterSchoolWithAdminInput {
  school: {
    name: string;
    slug: string;
    address?: string;
  };
  user: {
    email: string;
    password: string;
    name?: string;
  };
}
