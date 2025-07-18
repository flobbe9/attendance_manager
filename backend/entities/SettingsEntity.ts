import AbstractEntity from "../abstract/Abstract_Schema";

export class SettingsEntity extends AbstractEntity {
    key: string;
    value?: string | null;
}
