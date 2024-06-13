declare var $VindEngine: { [key: string]: any };

declare var $stores: { [key: string]: { [key: string]: any } };
declare var $router: { [key: string]: { [key: string]: any } };
declare var $props: { [key: string]: { [key: string]: any } };

declare var ref: <T>(value: T) => any;
declare var computed: <T>(callback: () => T) => { value: ReturnType<callback> };
declare var watch: (any, callback) => void;
declare type Store = (destructurableProperties) => { [key: string]: any }