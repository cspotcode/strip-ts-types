type a=any;/* what */
import {* as whatever} from 'whatever';

/**/interface Whatever {
    
}/**/

type AlsoWhatever = Whatever;

class Test implements Whatever extends Base {
    foo:number;
    bar:number = 123;
    readonly effectivelyConst = 'I will not change';
}

const test = void 0;

function foo<T>(a:number, b:string, c:void):Promise<T>;
function foo<T>(a:Map<number, string>, b:string, c:string):Promise<T>;
function foo<T>(a:number,b: string):Promise<T>{
    const c = (window as Node) + a;
    const c = <Node> window + a;

    let foo = 1 > 0 ? 'yes!' : 'no';
    return `${ b }${ c }`;
}