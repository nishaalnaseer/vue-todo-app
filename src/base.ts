
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
