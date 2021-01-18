'use strict';

module.exports = {
    meanVariance,
    standardDeviation,
    average,
    sum,
    min,
    max,
    movingAverage,
    movingFunction,
    validateData
};

function sum(data) {
    data = validateData(data);
    let varSum = data.reduce(function (sum, value) {
        return sum + value;
    }, 0);
    return varSum;
};

function average(data) {
    data = validateData(data);
    let varSum = sum(data);
    let avg = varSum / data.length;
    return avg;
};

function meanVariance(data) {
    data = validateData(data);
    let variances = data.map(function (value, index, arr) {
        if (index < arr.length - 1) {
            return Math.abs(value - arr[index + 1]);
        }
        else {
            return Math.abs(value);
        }
    });
    
    let varSum = variances.reduce(function (sum, value) {
        return sum + value;
    }, 0);

    let avg = varSum / variances.length;
    //console.log(avg);
    return avg;
};

function standardDeviation(data) {
    data = validateData(data);
    let avg = average(data);
    let squareDiffs = data.map(function (value) {
        let diff = value - avg;
        let sqrDiff = diff * diff;
        return sqrDiff;
    });
    let avgSquareDiff = average(squareDiffs);
    let stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
};

function min(data) {
    data = validateData(data);
    let minVal = data.reduce(function (minVal, value) {
        return (value < minVal) ? value : minVal;
    });
    return minVal;
};

function max(data) {
    data = validateData(data);
    let maxVal = data.reduce(function (maxVal, value) {
        return ((value > maxVal) ? value : maxVal);
    });
    return maxVal;
};

function movingAverage(data, period) {
    return movingFunction(data, period, average);
};

function movingFunction(data, period, func) {
    if (data === undefined) {
        throw new Error("the data parameter must be a number[].");
    }
    let returnValue = [];
    let index;
    let lowIndex;
    let highIndex;
    let tempData;
    for (index = 0; index < data.length; index += 1) {
        if (index < (period - 1)) {
            returnValue[index] = undefined;
        }
        else {
            lowIndex = (index + 1) - period;
            highIndex = index + 1;
            tempData = data.slice(lowIndex, highIndex);
            returnValue[index] = func(tempData);
        }
    }
    return returnValue;
};

function validateData(data) {
    if (data === undefined) {
        throw new Error("the data parameter must be a number[].");
    }
    return data.filter(function (item) {
        return item != undefined;
    });
};