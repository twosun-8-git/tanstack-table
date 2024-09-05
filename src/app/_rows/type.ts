export type Sub = {
  birthday: string;
  bloodtype: string;
  club: string;
};

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
  details?: Sub;
};
