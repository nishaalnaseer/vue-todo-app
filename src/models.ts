import {basicStringValidation, beforeTodayValidation, birthDateValidation} from "./base.ts";

export type ApplicationBaseField = string | number | boolean
  | Date | ApplicationBaseObject;

export interface ApplicationBaseObject {
  [key: string]: ApplicationBaseField
}
export type Mode = | "View" | "Create" | "Edit";

export type FormFieldType =
  | "TextInputField"
  | "DateInputField"
  | "CheckBoxInputField";


interface Page<T = ApplicationBaseObject> {
  total_rows: number;
  current_page: number;
  rows_per_page: number;
  page: T[];   // <-- now typed with T
}

export interface ApplicationFormFieldMetaData {
  title: string;
  showOnTable: boolean;
  formOverrideAsReadOnly: boolean;
  formInputType: FormFieldType;

  jsonKey: string;
  dumpOnCreate: boolean;
  dumpOnUpdate: boolean;

  positionRow: number;
  positionColumn: number;
  flex: number;

  fromJson?(value: ApplicationBaseField): ApplicationBaseField;
  toStr(value: ApplicationBaseField): string;
  fieldValidation(value: ApplicationBaseField): ApplicationBaseField | null;
}

export interface ApplicationField {
  title: string;

  value: ApplicationBaseField;
}

export interface ApplicationModelFields {
  id: string;
  fields: ApplicationField[];
  object: ApplicationBaseObject;
}

export interface PaginationMeta {
  readonly metadata: Record<string, ApplicationFormFieldMetaData>;
  resources: ApplicationModelFields[];

  readonly getPostPatchRoute: string;
  readonly getResourcesRoute: string;
  readonly overrideAsReadonly: boolean;
  readonly updateRights: string;
  readonly writeRights: string;
  readonly paginatedHeading: string;
  readonly retrieveOnModelView: boolean;

  total_rows: number;
  current_page: number;
  rows_per_page: number;

  isWriteable(rights: string[]): boolean;
  isUpdatable(rights: string[]): boolean;
  onResponse(response: Response): void;
  toStr(cell: ApplicationField): string;
  idFromJson(_: ApplicationBaseObject): string;
}

export abstract class PaginatedEntity implements PaginationMeta {
  readonly getResourcesRoute!: string;
  readonly overrideAsReadonly!: boolean;
  readonly getPostPatchRoute!: string;
  readonly metadata!: Record<string, ApplicationFormFieldMetaData>;
  resources!: ApplicationModelFields[];
  readonly updateRights!: string;
  readonly writeRights!: string;
  readonly paginatedHeading!: string;
  readonly formHeadingOnCreate!: string;
  readonly formHeadingOnUpdate!: string;
  readonly formHeadingOnRead!: string;
  readonly retrieveOnModelView!: boolean;

  isUpdatable(rights: string[]): boolean {
    return this.updateRights in rights;
  }

  isWriteable(rights: string[]): boolean {
    return this.writeRights in rights;
  }

  toStr(cell: ApplicationField): string {
    const header = this.metadata[cell.title];
    if(!header) {
      throw `Header for cell ${cell.title} not found. headers: ${this.metadata}`;
    }
    return header.toStr(cell.value);
  }

  current_page: number = 0;
  rows_per_page: number = 0;
  total_rows: number = 0;
  totalPages: number = 0;

  calculatePageMetaData(content: Page) {
    this.total_rows = content.total_rows;
    this.current_page = content.current_page;
    this.rows_per_page = content.rows_per_page;
    this.totalPages = Math.ceil(this.total_rows / this.rows_per_page);
  }

  async onResponse(response: Response): Promise<void> {
    let content: Page = await response.json();
    this.resources = [];
    const resources = content.page;
    this.calculatePageMetaData(content);

    for (let resource of resources) {
      const fields = [];
      for (const [key, meta] of
        Object.entries(this.metadata)) {
        let fieldValue = resource[meta.jsonKey];

        if(fieldValue == undefined) {
          console.error(`field value for ${key} is ${fieldValue}`);
          continue;
        }

        if(meta.fromJson != null) {
          fieldValue = meta.fromJson(fieldValue);
        }

        fields.push(
          {
            title: meta.title,
            value: fieldValue,
          },
        )
      }
      this.resources.push({
        id: this.idFromJson(resource),
        fields: fields,
        object: resource,
      });
    }
  }

  idFromJson(_: ApplicationBaseObject): string {
    throw "unimplemented";
  }
}

export interface Todo extends ApplicationBaseObject {
  id: number,
  todo: string;
  date: Date;
  done: boolean;
}
export interface User extends ApplicationBaseObject {
  id: number;            // default 0
  staff_id: string;
  name: string;
  created: Date;       // ISO datetime string (e.g. new Date().toISOString())
  joined: Date;        // ISO datetime string
  enabled: boolean;
  email: string;
}

export class TodoPagination extends PaginatedEntity {
  readonly getResourcesRoute: string = "/todos";
  readonly overrideAsReadonly: boolean = false;
  readonly getPostPatchRoute: string = "/todo";
  readonly retrieveOnModelView = false;
  readonly metadata: Record<string, ApplicationFormFieldMetaData> = {
    "UID": {
      title: "UID",
      showOnTable: true,
      formOverrideAsReadOnly: true,
      formInputType: "TextInputField",
      jsonKey: "id",
      dumpOnCreate: false,
      dumpOnUpdate: true,

      positionRow: 0,
      positionColumn: 0,
      flex: 12,

      fieldValidation(value: string): string | null {
        return basicStringValidation(value);
      },
      toStr: (value: number) => {
        return `${value}`;
      }
    },
    "Date": {
      title: "Date",
      showOnTable: true,
      jsonKey: "date",
      dumpOnCreate: true,
      dumpOnUpdate: true,

      positionRow: 1,
      positionColumn: 0,
      flex: 12,

      fieldValidation(value: Date): Date | null {
        return beforeTodayValidation(value);
      },
      formOverrideAsReadOnly: false,
      formInputType: "DateInputField",
      toStr: (value: Date) => {
        return value.toUTCString().replace("GMT", "");
      },
      fromJson(value: string | number): ApplicationBaseField {
        return new Date(value);
      }
    },
    "Todo": {
      title: "Todo",
      showOnTable: true,
      jsonKey: "todo",
      dumpOnCreate: true,

      positionRow: 2,
      positionColumn: 0,
      flex: 12,

      dumpOnUpdate: true,
      fieldValidation(value: string): string | null {
        return basicStringValidation(value);
      },
      formOverrideAsReadOnly: false,
      formInputType: "TextInputField",
      toStr: (value: string) => value},
    "Completed": {
      title: "Completed",
      showOnTable: true,
      jsonKey: "done",
      dumpOnCreate: true,

      positionRow: 3,
      positionColumn: 0,
      flex: 12,

      dumpOnUpdate: true,
      fieldValidation(value: boolean): boolean {
        return value;
      },
      formOverrideAsReadOnly: false,
      formInputType: "CheckBoxInputField",
      toStr: (value: boolean) => value ? "Yes" : "No"
    },
  };

  readonly updateRights: string = "";
  readonly writeRights: string = "";
  readonly paginatedHeading: string = "Todos";
  readonly formHeadingOnCreate = "Create Todo";
  readonly formHeadingOnUpdate = "Edit Todo";
  readonly formHeadingOnRead = "Todo Details";

  idFromJson(value: ApplicationBaseObject): string {
    return `${value.id}`;
  }

  constructor() {
    super();
    this.resources = [];
  }
}

export class UsersPagination extends PaginatedEntity {
  readonly getResourcesRoute: string = "/users";
  readonly overrideAsReadonly: boolean = false;
  readonly getPostPatchRoute: string = "/users";
  readonly metadata: Record<string, ApplicationFormFieldMetaData> = {
    "UID": {
      title: "UID",
      showOnTable: true,
      formOverrideAsReadOnly: true,
      jsonKey: "id",
      dumpOnCreate: false,
      dumpOnUpdate: true,
      fieldValidation(value: number): number {
        return value;
      },
      formInputType: "TextInputField",
      toStr: (value: string) => {
        return value;
      },

      positionRow: 0,
      positionColumn: 0,
      flex: 12,

    },
    "Staff ID": {
      title: "Staff ID",
      showOnTable: true,
      jsonKey: "staff_id",
      dumpOnCreate: true,
      dumpOnUpdate: true,
      fieldValidation(value: string): string | null {
        return basicStringValidation(value);
      },
      formOverrideAsReadOnly: false,
      formInputType: "TextInputField",
      toStr: (value: string) => {
        return value;
      },

      positionRow: 1,
      positionColumn: 0,
      flex: 6,
    },
    "Name": {
      title: "Name",
      showOnTable: true,
      jsonKey: "name",
      dumpOnCreate: true,
      dumpOnUpdate: true,
      fieldValidation(value: string): string | null {
        return basicStringValidation(value);
      },
      formOverrideAsReadOnly: false,
      formInputType: "TextInputField",
      toStr: (value: string) => {
        return value;
      },

      positionRow: 2,
      positionColumn: 0,
      flex: 12,
    },
    "Email": {
      title: "Email",
      showOnTable: true,
      jsonKey: "email",
      dumpOnCreate: true,
      fieldValidation(value: string): string | null {
        return basicStringValidation(value);
      },
      dumpOnUpdate: true,
      formOverrideAsReadOnly: false,
      formInputType: "TextInputField",
      toStr: (value: string) => {
        return value;
      },

      positionRow: 3,
      positionColumn: 0,
      flex: 12,
    },
    "Joined Date": {
      title: "Joined Date",
      showOnTable: true,
      jsonKey: "joined",
      dumpOnCreate: true,
      dumpOnUpdate: true,
      fieldValidation(value: Date): Date | null {
        return beforeTodayValidation(value);
      },
      formOverrideAsReadOnly: false,
      formInputType: "DateInputField",
      toStr: (value: Date) => {
        // const shifted = new Date(value.getTime() + 5 * 60 * 60 * 1000);
        return value.toUTCString().replace("GMT", "");
      },
      fromJson(value: string | number): ApplicationBaseField {
        return new Date(value);
      },

      positionRow: 1,
      positionColumn: 1,
      flex: 12,
    },
    "User Created": {
      title: "User Created",
      showOnTable: true,
      formOverrideAsReadOnly: true,
      jsonKey: "created",
      dumpOnCreate: false,
      dumpOnUpdate: false,
      fieldValidation(value: Date): Date | null {
        return birthDateValidation(value);
      },
      formInputType: "DateInputField",
      toStr: (value: Date) => {
        return value.toUTCString().replace("GMT", "");
      },
      fromJson(value: string | number): ApplicationBaseField {
        return new Date(value);
      },

      positionRow: 5,
      positionColumn: 0,
      flex: 12,
    },
    "Enabled": {
      title: "Enabled",
      showOnTable: true,
      jsonKey: "enabled",
      dumpOnCreate: true,
      dumpOnUpdate: true,
      fieldValidation(value: boolean): boolean {
        return value;
      },
      formOverrideAsReadOnly: false,
      formInputType: "CheckBoxInputField",
      toStr: (value: boolean) => value ? "Yes" : "No",

      positionRow: 4,
      positionColumn: 0,
      flex: 12,
    },
  };

  readonly updateRights: string = "";
  readonly writeRights: string = "";

  readonly paginatedHeading: string = "Users";
  readonly formHeadingOnCreate = "Create User";
  readonly formHeadingOnUpdate = "Edit User";
  readonly formHeadingOnRead = "User Details";

  // todo implement on model view
  readonly retrieveOnModelView = true;

  idFromJson(value: ApplicationBaseObject): string {
    return `${value.id}`;
  }

  constructor() {
    super();
    this.resources = [];
  }
}