type ApplicationPrimitive = string | number | boolean | Date;

// interface ModelPrimitiveMeta {
//   value: ApplicationPrimitive;
// }
//
// class ModelPrimitive {
//   constructor() {
//   }
// }

export interface ApplicationTableHead {
  title: string;

  toStr(value: ApplicationPrimitive): string;
}

export interface ApplicationRowCell {
  title: string;
  showOnTable: boolean;
  value: ApplicationPrimitive;
}

export interface ApplicationTableRow {
  cells: ApplicationRowCell[];
}

export interface PaginationMeta {
  readonly tableHeaders: Record<string, ApplicationTableHead>;
  tableRows: ApplicationTableRow[];

  readonly postPatchRoute: string;
  readonly getRoute: string;
  readonly overrideAsReadonly: boolean;
  readonly updateRights: string;
  readonly writeRights: string;
  readonly heading: string;

  isWriteable(rights: string[]): boolean;
  isUpdatable(rights: string[]): boolean;
}

export abstract class PaginatedEntity implements PaginationMeta {
  readonly getRoute!: string;
  readonly overrideAsReadonly!: boolean;
  readonly postPatchRoute!: string;
  readonly tableHeaders!: Record<string, ApplicationTableHead>;
  tableRows!: ApplicationTableRow[];
  readonly updateRights!: string;
  readonly writeRights!: string;
  readonly heading!: string;

  isUpdatable(rights: string[]): boolean {
    return this.updateRights in rights;
  }

  isWriteable(rights: string[]): boolean {
    return this.writeRights in rights;
  }
}

export interface Todo {
  todo: string;
  date: Date;
  done: boolean;
}

export class TodoPagination extends PaginatedEntity {
  readonly getRoute: string = "/todos";
  readonly overrideAsReadonly: boolean = false;
  readonly postPatchRoute: string = "/todo";
  readonly tableHeaders: Record<string, ApplicationTableHead> = {
    "Date": {title: "Date", toStr: (value: Date) => {
      const shifted = new Date(value.getTime() + 5 * 60 * 60 * 1000);
      return shifted.toUTCString();
    }},
    "Todo": {title: "Todo", toStr: (value: string) => value},
    "Completed": {
      title: "Completed", toStr: (value: boolean) => value ? "Yes" : "No"
    },
  };

  readonly updateRights: string = "";
  readonly writeRights: string = "";
  readonly heading: string = "Todos";

  constructor() {
    super();
    this.tableRows = [];
  }
}

