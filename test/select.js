
var sql = require('../lib');

exports.select = {
    "Basic select" : function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'});

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1');

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1');

        test.done();
    },

    "Adding columns to query after": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).select(['col4']);

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3, col4 from table1 t1');

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3, col4 from table1 t1');

        test.done();
    },

    "Where clause with number": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : 123 });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = 123');
        test.deepEqual(query.values, [ ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = 123');
        test.deepEqual(query.values, [ ]);

        test.done();
    },

    "Where clause with string": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : 'abc' });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = ?');
        test.deepEqual(query.values, [ 'abc' ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = $1');
        test.deepEqual(query.values, [ 'abc' ]);

        test.done();
    },

    "Where clause with boolean": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : false });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = false');
        test.deepEqual(query.values, [ ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = false');
        test.deepEqual(query.values, [ ]);

        test.done();
    },

    "Where clause with null": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : null });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 is null');
        test.deepEqual(query.values, [ ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 is null');
        test.deepEqual(query.values, [ ]);

        test.done();
    },
    
    "Where clause with not null": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : sql.operator.not(null) });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 is not null');
        test.deepEqual(query.values, [ ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 is not null');
        test.deepEqual(query.values, [ ]);

        test.done();
    },
    
    "Where clause with function": function (test) {
        var sha2 = sql.func('sha2', sql.func('concat', sql.identifier('salt'), 'abc'), 256);
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : sha2 });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = sha2(concat(salt, ?), 256)');
        test.deepEqual(query.values, [ 'abc' ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = sha2(concat(salt, $1), 256)');
        test.deepEqual(query.values, [ 'abc' ]);

        test.done();
    },

    "Where clause with or": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({ or: { 'col4' : null, 'col5' : 123 } });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 is null or col5 = 123');
        test.deepEqual(query.values, [ ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 is null or col5 = 123');
        test.deepEqual(query.values, [ ]);

        test.done();
    },

    "Order by": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).orderBy({ 'col1' : null, 'col2' : 'desc' });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 order by col1, col2 desc');

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 order by col1, col2 desc');

        test.done();
    },

    "Limit clause": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).limit(100, 5);

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 limit 100 offset 5');

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 limit 100 offset 5');

        test.done();
    },
    
    "select with in operator and subquery": function (test) {
        var statement1 = sql.select([ 't1.col1' ]).from({'table1' : 't1'});
        var statement2 = sql.select([ 't2.col2' ]).from({ 'table2' : 't2' }).where({ 't2.col3' : sql.operator.in(statement1) });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement2.toQuery();
        test.equal(query.sql, 'select t2.col2 from table2 t2 where t2.col3 in (select t1.col1 from table1 t1)');

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement2.toQuery();
        test.equal(query.sql, 'select t2.col2 from table2 t2 where t2.col3 in (select t1.col1 from table1 t1)');

        test.done();
    },
    
    "select with not in operator and subquery": function (test) {
        var statement1 = sql.select([ 't1.col1' ]).from({'table1' : 't1'});
        var statement2 = sql.select([ 't2.col2' ]).from({ 'table2' : 't2' }).where({ 't2.col3' : sql.operator.not_in(statement1) });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement2.toQuery();
        test.equal(query.sql, 'select t2.col2 from table2 t2 where t2.col3 not in (select t1.col1 from table1 t1)');

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement2.toQuery();
        test.equal(query.sql, 'select t2.col2 from table2 t2 where t2.col3 not in (select t1.col1 from table1 t1)');

        test.done();
    },
    
    "select with subquery in from": function (test) {
        var statement1 = sql.select([ 't1.col1' ]).from({'table1' : 't1'}).where({ 't1.col2' : 'abc' });
        var statement2 = sql.select([ 't2.col1' ]).from(statement1, 't2');

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement2.toQuery();
        test.equal(query.sql, 'select t2.col1 from (select t1.col1 from table1 t1 where t1.col2 = ?) t2');
        test.deepEqual(query.values, [ 'abc' ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement2.toQuery();
        test.equal(query.sql, 'select t2.col1 from (select t1.col1 from table1 t1 where t1.col2 = $1) t2');
        test.deepEqual(query.values, [ 'abc' ]);

        test.done();
    },
    
    "select with unioned subquery in from": function (test) {
        var statement1 = sql.select([ 't1.col1' ]).from({'table1' : 't1'}).where({ 't1.col2' : 'abc' });
        var statement2 = sql.select([ 't2.col1' ]).from({'table2' : 't2'}).where({ 't2.col2' : 'efg' });
        var statement3 = statement1.union(statement2);
        var statement4 = sql.select([ 't3.col1' ]).from(statement3, 't3');

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement4.toQuery();
        test.equal(query.sql, 'select t3.col1 from (select t1.col1 from table1 t1 where t1.col2 = ? union select t2.col1 from table2 t2 where t2.col2 = ?) t3');
        test.deepEqual(query.values, [ 'abc', 'efg' ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement4.toQuery();
        test.equal(query.sql, 'select t3.col1 from (select t1.col1 from table1 t1 where t1.col2 = $1 union select t2.col1 from table2 t2 where t2.col2 = $2) t3');
        test.deepEqual(query.values, [ 'abc', 'efg' ]);

        test.done();
    }
    
};

