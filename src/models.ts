import {
  basicStringValidation, beforeTodayValidation, birthDateValidation
} from "./base.ts";

export type ApplicationBaseField = string | number | boolean
  | Date | ApplicationBaseObject;

export interface ApplicationBaseObject {
  [key: string]: ApplicationBaseField
}
export type Mode = | "View" | "Create" | "Edit";

export type FormFieldType =
  | "TextInputField"
  | "DateInputField"
  | "CheckBoxInputField" | "ForeignRefInputField";


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
  tailwindClasses: string;

  args?: {appModel?: PaginatedEntity};

  fromJson?(value: ApplicationBaseField): ApplicationBaseField;
  toStr(value: ApplicationBaseField): string;
  fieldValidation(value: ApplicationBaseField): ApplicationBaseField | null;
}

export interface ApplicationField {
  title: string;

  value: ApplicationBaseField;
}

export interface ApplicationModelFields {
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

  readonly jsonKeyMap: Record<string, string>;

  total_rows: number;
  current_page: number;
  rows_per_page: number;

  isWriteable(rights: string[]): boolean;
  isUpdatable(rights: string[]): boolean;
  onResponse(response: Response): void;
  toStr(cell: ApplicationField): string;
  setUpJsonKeyMap(): void;
  getUniqueStr(result: ApplicationBaseObject): string;
  getUniqueID(result: ApplicationBaseObject): number;
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
        fields: fields,
        object: resource,
      });
    }
  }

  readonly jsonKeyMap: Record<string, string> = {};
  jsonKeyMapSetUp = false;
  setUpJsonKeyMap() {
    if(!this.jsonKeyMapSetUp) {
      for (const [title, value] of
        Object.entries(this.metadata)) {
        this.jsonKeyMap[value.jsonKey] = title;
      }
      this.jsonKeyMapSetUp = true;
    }
  }


  getUniqueStr(_: ApplicationBaseObject):string {throw "unimplemented"}
  getUniqueID(_: ApplicationBaseObject): number {throw "unimplemented"}
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
      tailwindClasses: "",

      positionRow: 0,
      positionColumn: 0,
      flex: 3,

      fieldValidation(value: number): number {
        return value;
      },
      toStr: (value: number) => {
        return `${value}`;
      }
    },
    "Date": {
      title: "Date",
      showOnTable: true,
      jsonKey: "date",
      dumpOnCreate: false,
      dumpOnUpdate: false,
      tailwindClasses: "text-end",

      positionRow: 0,
      positionColumn: 1,
      flex: 9,

      fieldValidation(value: Date): Date | null {
        return beforeTodayValidation(value);
      },
      formOverrideAsReadOnly: true,
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
      tailwindClasses: "",

      positionRow: 1,
      positionColumn: 0,
      flex: 12,

      dumpOnUpdate: true,
      fieldValidation(value: string): string | null {
        return basicStringValidation(value);
      },
      formOverrideAsReadOnly: false,
      formInputType: "TextInputField",
      toStr: (value: string) => value},

    "User": {
      title: "User",
      showOnTable: true,
      jsonKey: "user",
      dumpOnCreate: true,
      tailwindClasses: "",

      positionRow: 2,
      positionColumn: 0,
      flex: 12,

      dumpOnUpdate: true,
      fieldValidation(value: number): number {
        return value;
      },
      formOverrideAsReadOnly: false,
      formInputType: "ForeignRefInputField",
      toStr: (value: ApplicationBaseObject) => (value.name as string),
      args: {appModel: new UsersPagination()}
    },

    "Completed": {
      title: "Completed",
      showOnTable: true,
      jsonKey: "done",
      dumpOnCreate: true,
      tailwindClasses: "",

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

  constructor() {
    super();
    this.resources = [];
    this.setUpJsonKeyMap();
  }
}

export class UsersPagination extends PaginatedEntity {
  readonly getResourcesRoute: string = "/users";
  readonly overrideAsReadonly: boolean = false;
  readonly getPostPatchRoute: string = "/user";
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
      tailwindClasses: "",

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
      tailwindClasses: "",

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
      tailwindClasses: "",

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
      tailwindClasses: "",

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
      tailwindClasses: "",

      positionRow: 1,
      positionColumn: 1,
      flex: 6,
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
      tailwindClasses: "",

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
      tailwindClasses: "",

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

  constructor() {
    super();
    this.resources = [];
    this.setUpJsonKeyMap();

  }

  getUniqueStr(user: User):string {return user.name}
  getUniqueID(user: User): number {return user.id}
}