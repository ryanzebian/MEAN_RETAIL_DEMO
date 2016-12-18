var obj = {a:1};

test.bind(obj, 'firstParameter');

testWithP1('Second parameter');

function test(p1,p2){
    console.log('This =' + require('util').inspect(this));
    console.log('P1: '+p1);
    console.log('P2: '+p2);
}