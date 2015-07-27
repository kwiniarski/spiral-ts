

function extend(target, extension): void {
  Object.getOwnPropertyNames(extension).forEach((property: string) => {
    target[property] = extension[property];
  });
}

export function mixin(...implementations: Function[]) {
  return (target: Function) => {
    implementations.forEach(implementation => {
      extend(target.prototype, implementation.prototype);
    });
  }
}
