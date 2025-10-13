type ApplicationPrimitive = string | number | boolean | Date;

interface ApplicationBaseObject {}

interface Page<T = ApplicationBaseObject> {
  total_rows: number;
  current_page: number;
  rows_per_page: number;
  page: T[];   // <-- now typed with T
}

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
  id: string;
  cells: ApplicationRowCell[];
  object: ApplicationBaseObject;
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

  total_rows: number;
  current_page: number;
  rows_per_page: number;


  isWriteable(rights: string[]): boolean;
  isUpdatable(rights: string[]): boolean;
  onResponse(response: Response): void;
  toStr(cell: ApplicationRowCell): string;
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

  onResponse(_: Response): void {
    throw "unimplemented";
  }

  toStr(cell: ApplicationRowCell): string {
    const header = this.tableHeaders[cell.title];
    if(!header) {
      throw `Header for cell ${cell.title} not found. headers: ${this.tableHeaders}`;
    }
    return header.toStr(cell.value);
  }

  current_page: number = 0;
  rows_per_page: number = 0;
  total_rows: number = 0;
  totalPages: number = 0;
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

export class UsersPagination extends PaginatedEntity {
  readonly getRoute: string = "/users";
  readonly overrideAsReadonly: boolean = false;
  readonly postPatchRoute: string = "/users";
  readonly tableHeaders: Record<string, ApplicationTableHead> = {
    "Staff ID": {title: "Staff ID", toStr: (value: string) => {
      return value;
    }},
    "Name": {title: "Name", toStr: (value: string) => {
      return value;
    }},
    "Email": {title: "Email", toStr: (value: string) => {
      return value;
    }},
    "Joined Date": {title: "Joined Date", toStr: (value: Date) => {
      const shifted = new Date(value.getTime() + 5 * 60 * 60 * 1000);
      return shifted.toUTCString().replace("GMT", "");
    }},
    "User Created": {title: "User Created", toStr: (value: Date) => {
      const shifted = new Date(value.getTime() + 5 * 60 * 60 * 1000);
      return shifted.toUTCString().replace("GMT", "");
    }},
    "Enabled": {
      title: "Enabled", toStr: (value: boolean) => value ? "Yes" : "No"
    },
  };

  readonly updateRights: string = "";
  readonly writeRights: string = "";
  readonly heading: string = "Users";

  async onResponse(response: Response): Promise<void> {
    let content: Page<User> = await response.json();
    this.tableRows = [];
    const users = content.page;

    this.total_rows = content.total_rows;
    this.current_page = content.current_page;
    this.rows_per_page = content.rows_per_page;
    this.totalPages = Math.ceil(this.total_rows / this.rows_per_page);

    for (let user of users) {
      user.joined = new Date(user.joined);
      user.created = new Date(user.created);
      const cells = [
        {
          title: "Staff ID",
          showOnTable: true,
          value: user.staff_id,
        },
        {
          title: "Name",
          showOnTable: true,
          value: user.name,
        },
        {
          title: "Email",
          showOnTable: true,
          value: user.email,
        },
        {
          title: "Joined Date",
          showOnTable: true,
          value: user.joined,
        },
        {
          title: "User Created",
          showOnTable: true,
          value: user.created,
        },
        {
          title: "Enabled",
          showOnTable: true,
          value: user.enabled,
        },
      ]
      this.tableRows.push({cells: cells, object: user, id: `${user.id}`});

    }
    console.log(this.tableRows);
  }

  constructor() {
    super();
    this.tableRows = [];
  }
}