import {
  adminAc,
  createAccessControl,
  defaultStatements,
  ownerAc,
} from "better-auth/plugins/access";

const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  project: ["create", "update", "delete"],
  ...ownerAc.statements,
});

export const admin = ac.newRole({
  project: ["create", "update"],
  ...adminAc.statements,
});

export const teacher = ac.newRole({
  project: ["create", "update"],
});

export const guardian = ac.newRole({
  project: [],
});
