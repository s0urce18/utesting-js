const Test = require("utesting").Test;
const TestCase = require("utesting").TestCase;

let t = new Test();

let cases1 = [new TestCase([100000], 100000), new TestCase([200000], 200000), new  TestCase([200000], 300000)];

function func1(a){
    let n = 0;
    for(let i = 0; i < a; i ++){
        n ++;
    }
    return n;
}

t.addTestUnit(func1, cases1);

let cases2 = [new TestCase([[1, 5, 2, 5]], [1, 2, 5, 5]), new TestCase([[1, 7, 3, 7, 9, 0]], [0, 1, 3, 7, 7, 9])];

function func2(a){
    let k = 0;
    while(k < a.length - 1){
        k = 0;
        for(let j = 0; j < a.length - 1; j ++){
            if(a[j] > a[j+1]){
                a[j] = a[j] + a[j+1];
                a[j+1] = a[j] - a[j+1];
                a[j] = a[j] - a[j+1];
            }
            else{
                k ++;
            }
        }
    }
    return a;
}

t.addTestUnit(func2, cases2);

function func3(a){
    return a / 0;
}

t.addTestUnit(func3, [new TestCase([1], 1)], true);

function func4(a){
    let result = 1;
    for(let i = 1; i <= a; i ++){
        result *= i;
    }
    return result
}

t.addTestUnit(func4, [new TestCase([100000], 100000)], false, true);

t.testAll();