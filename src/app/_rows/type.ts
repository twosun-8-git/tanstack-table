export type Student = {
  no: number;
  lastName: string;
  firstName: string;
  gender: string;
  grade: number;
  class: number;
  lang: number;
  arith: number;
  science: number;
  details?: {
    birthday: string;
    bloodtype: string;
    club: string;
  };
};
