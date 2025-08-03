// allow png imports for typescript
declare module "*.png" {
    const value: any;
    export = value;
}