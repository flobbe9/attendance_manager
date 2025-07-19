import AbstractEntity from "../abstract/AbstractEntity";

export class SettingsEntity extends AbstractEntity {
    key: string;
    value?: string | null;
}
