/**
 * Same thing as ```Record``` but not demanding to define every key (when using keyof interface);
 * 
 * @since 0.0.1
 */
export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;