declare var $VindEngine: any;

declare var $stores: { [key: string]: { [key: string]: any } };
declare var $router: { [key: string]: { [key: string]: any } };
declare var $props: { [key: string]: { [key: string]: any } };

declare var ref: <T>(value: T) => { value: T } | any;
declare var computed: <T>(callback: () => T) => ReturnType<callback>;
declare var watch: <T>(any, callback) => void;
declare type Store = (destructurableProperties) => { [key: string]: any }