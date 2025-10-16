interface CTX {
  reason: string;
}

export interface PydanticError {
  type: string;
  loc: string[];
  msg: string;
  input: string;
  ctx: CTX;
}

export interface ErrorFromServer {
  jsonKey: string;
  message: string;
}


export function startLoading() {
  const overlay = document.getElementById("loading-overlay");
  if(!overlay) {
    console.error("Overlay on ID loading-overlay not found!");
    return;
  }
  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
}

export function stopLoading() {
  const overlay = document.getElementById("loading-overlay");
  if(!overlay) {
    console.error("Overlay on ID loading-overlay not found!");
    return;
  }
  overlay.classList.remove("flex");
  overlay.classList.add("hidden");
}


export function basicStringValidation(value: string): string | null {
  const stripped = value.trim();

  if(stripped === "") {
    return null;
  }
  return stripped;
}


export function birthDateValidation(value: Date): Date | null {
  return value;
}

export function beforeTodayValidation(value: Date): Date | null {
  return value;
}

export async function responseToStr(response: Response): Promise<ErrorFromServer[]> {
  if(response.status < 400) return [];
  if(response.status == 401) {
    return [{
      jsonKey: "",
      message: "You have been logged out"
    }];
  }

  if(response.status === 500) {
    return [{
      jsonKey: "",
      message: await response.text()
    }];
  }
  const content = await response.json();

  const detail: any = content.detail;
  if(response.status === 422) {
    if (typeof detail === "string") {
      return [{
        jsonKey: "",
        message: detail
      }];
    } else {
      const _errors: ErrorFromServer[] = [];
      const errors: PydanticError[] = detail;
      for(let err of errors) {
        _errors.push({
          jsonKey: err.loc[1] ?? "",
          message: err.msg
        });
      }
      return _errors;
    }
  }

  return [];
}
