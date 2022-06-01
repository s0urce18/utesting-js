const fs = require("fs");

class ResultState{ // class for result state
    
    /**
     * @param {Boolean} result shows is the case passed or not 
     * @param {String} text text representation of result
     * @constructor
     */    

    result = undefined;
    text = "";

    constructor(result, text){
        this.result = result;
        this.text = text;
    }
}

class ResultStates{ // class with result states

    /**
     * @param {ResultState} passed means that test passed
     * @param {ResultState} failed means that test failed
     * @param {ResultState} error means that test failed by some error
     * @param {ResultState} time means that test was runned to check time
     */

    static passed = new ResultState(true, "PASSED");
    static failed = new ResultState(false, "FAILED");
    static error = new ResultState(false, "ERROR");
    static time = new ResultState(true, "TIME");

}

class Unit{ // class with unit

    /**
     * @param {Function} callback unit callback
     * @param {String} name callback name
     * @constructor
     */

    callback = undefined;
    name = "";

    constructor(callback){
        this.callback = callback;
        this.name = callback.name;
    }
}

class TestCase{ // class with test case

    /**
     * @param {Array} params params for test case
     * @param {*} answer answer for test case
     * @constructor
     */

    params = [];
    answer = undefined;

    constructor(params, answer){
        this.params = params;
        this.answer = answer;
    }
}

class TestGroup{ // class with test group

    /**
     * @param {Unit} unit Unit object which will be tested
     * @param {Array} cases Array of TestCase objects which will be used for testing unit
     * @param {Boolean} onlyErrors means will be only testing on errors(without comparing with answer) or general one
     * @param {Boolean} onlyTime means will be only testing on time(without comparing with answer) or general one
     * @param {Boolean} noPrint means will be printing or not
     * @constructor
     */

    unit = undefined;
    cases = [];
    onlyErrors = false;
    onlyTime = false;
    noPrint = false;

    constructor(unit, cases, onlyErrors, onlyTime, noPrint){
        this.unit = unit;
        this.cases = cases;
        this.onlyErrors = onlyErrors;
        this.onlyTime = onlyTime;
        this.noPrint = noPrint;
    }
}

class TestCaseResult{ // class with test case result
    
    /**
     * @param {Unit} unit Unit object which was be tested
     * @param {Array} params params from test case
     * @param {*} answer answer from test case
     * @param {*} returned unit returned
     * @param {Number} workTime time of unit working
     * @param {ResultState} result testing result
     * @constructor
     */

    unit = undefined;
    params = [];
    answer = undefined;
    returned = undefined;
    workTime = "";
    result = undefined;

    constructor(unit, tCase, returned, result, workTime){
        this.unit = unit;
        this.params = tCase.params;
        this.answer = tCase.answer;
        this.returned = returned;
        this.result = result;
        this.workTime = workTime;
    }
}

class Test{ // main class for testing

    /**
     * @param {Array} groups Array with TestGroup objects
     * @method #outputLine method for outputing mark line
     * @method #outputUnit method for outputing unit
     * @method #outputCase method for outputing case
     * @method test method for testing test group with TestGroup object and output as arguments
     * @method addTestUnit method for adding test unit to groups
     * @method testAll method for running testing all groups
     */

    groups = [];

    #outputLine(char, output){
        output(char.repeat(100) + (output != console.log ? "\n" : ""));
    }

    #outputUnit(unit, output){
        output(`UNIT: ${unit.name}` + (output != console.log ? "\n" : ""));
    }

    #outputCase(ind, tCase, onlyErrors, onlyTime, output){
        if(onlyErrors || onlyTime){
            output(`CASE ${ind}: ${tCase.result.text}` + (output != console.log ? "\n" : ""));
        }
        else{
            output(`CASE ${ind}:` + (output != console.log ? "\n" : ""));
            output(`    Params: ${tCase.params}` + (output != console.log ? "\n" : ""));
            output(`    Correct answer: ${tCase.answer}` + (output != console.log ? "\n" : ""));
            output(`    Returned answer: ${tCase.returned}` + (output != console.log ? "\n" : ""));
            output(`    Result: ${tCase.result.text}` + (output != console.log ? "\n" : ""));
            output(`    Time: ${tCase.workTime} ms` + (output != console.log ? "\n" : ""));
        }        
    }

    test(group, output){
        let results = [];
        if(!group.noPrint){
            this.#outputLine("*", output);
            this.#outputUnit(group.unit, output);
        }
        let ind = 0;
        if(group.onlyErrors && group.onlyTime){
            for(let tCase of group.cases){
                if(!group.noPrint){
                    this.#outputLine("-", output);
                }
                let startTime = new Date().getTime();
                let returned = undefined;
                let result = undefined;
                let workTime = 0;
                try{
                    returned = group.unit.callback(...tCase.params);
                    workTime = new Date().getTime() - startTime;
                    result = new TestCaseResult(group.unit, tCase, undefined, new ResultState(true, `PASSED, TIME ( ${workTime} ms )`), workTime);
                    results.push(result);
                }
                catch(err){
                    workTime = new Date().getTime() - startTime;
                    result = new TestCaseResult(group.unit, tCase, undefined, new ResultState(false, `ERROR ( ${err.message} ), TIME ( ${workTime} ms )`), workTime);
                    results.push(result);
                }
                if(!group.noPrint){
                    this.#outputCase(ind, result, group.onlyErrors, group.onlyTime, output);
                }
                ind ++;
            }
        }
        else if(group.onlyErrors){
            for(let tCase of group.cases){
                if(!group.noPrint){
                    this.#outputLine("-", output);
                }
                let returned = undefined;
                let result = undefined;
                try{
                    returned = group.unit.callback(...tCase.params);
                    result = new TestCaseResult(group.unit, tCase, undefined, ResultStates.passed, undefined);
                    results.push(result);
                }
                catch(err){
                    result = new TestCaseResult(group.unit, tCase, undefined, new ResultState(false, `ERROR ( ${err.message} )`), undefined);
                    results.push(result);
                }
                if(!group.noPrint){
                    this.#outputCase(ind, result, group.onlyErrors, group.onlyTime, output);
                }
                ind ++;
            }
        }
        else if(group.onlyTime){
            for(let tCase of group.cases){
                if(!group.noPrint){
                    this.#outputLine("-", output);
                }
                let startTime = new Date().getTime();
                let returned = group.unit.callback(...tCase.params);
                let workTime = new Date().getTime() - startTime;
                let result = new TestCaseResult(group.unit, tCase, undefined, new ResultState(true, `PASSED, TIME ( ${workTime} ms )`), undefined);
                results.push(result);
                if(!group.noPrint){
                    this.#outputCase(ind, result, group.onlyErrors, group.onlyTime, output);
                }
                ind ++;
            }
        }
        else{
            for(let tCase of group.cases){
                if(!group.noPrint){
                    this.#outputLine("-", output);
                }
                let startTime = new Date().getTime();
                let returned = undefined;
                let result = undefined;
                let workTime = 0;
                let error = undefined;
                try{
                    returned = group.unit.callback(...tCase.params);
                }
                catch(err){
                    error = err;
                }
                workTime = new Date().getTime() - startTime;
                if(error != undefined){
                    result = new TestCaseResult(group.unit, tCase, returned, new ResultState(false, `ERROR ( ${error.message} )`), workTime);
                    results.push(result);
                }
                else if(JSON.stringify(returned) == JSON.stringify(tCase.answer)){
                    result = new TestCaseResult(group.unit, tCase, returned, ResultStates.passed, workTime);
                    results.push(result);
                }
                else{
                    result = new TestCaseResult(group.unit, tCase, returned, ResultStates.failed, workTime);
                    results.push(result);
                }
                if(!group.noPrint){
                    this.#outputCase(ind, result, group.onlyErrors, group.onlyTime, output);
                }
                ind ++;
            }
        }
        if(!group.noPrint){
            this.#outputLine("-", output);
        }
        return results;
    }

    addTestUnit(callback, cases, onlyErrors = false, onlyTime = false, noPrint = false){
        this.groups.push(new TestGroup(new Unit(callback), cases, onlyErrors, onlyTime, noPrint));
    }

    testAll(fileName = ""){
        let results = {};
        let output = console.log;
        let allPassed = true;
        if(fileName != ""){
            output = function (text) {fs.writeFile(fileName, text);}
        }
        for(let group of this.groups){
            let result = this.test(group, output);
            for(let res of result){
                allPassed &= res.result.result;
            }
            result[result[0].unit.name] = result;
        }
        this.#outputLine("*", output);
        if(allPassed){
            output("ALL CASES PASSED :)" + (output != console.log ? "\n" : ""));
        }
        else{
            output("NOT ALL CASES PASSED :(" + (output != console.log ? "\n" : ""));
        }
        this.#outputLine("*", output);
        return results;
    }
}

module.exports = {ResultState, ResultStates, Unit, TestCase, TestGroup, TestCaseResult, Test}