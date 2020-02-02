expression
  = conditionalOrExpression

conditionalOrExpression
	= head:conditionalAndExpression tail:( _ logicalOr _ conditionalAndExpression )* {
      const arr = [head];
      for (const t of tail) Array.prototype.push.apply(arr, t);
      return arr.length > 1 ? { op: '||', args: arr.filter(t=>t) } : arr[0];
    }

conditionalAndExpression
	= head:comparisonExpression tail:( _ logicalAnd _ comparisonExpression)* {
      const arr = [head];
      for (const t of tail) Array.prototype.push.apply(arr, t);
      return arr.length > 1 ? { op: '&&', args: arr.filter(t=>t) } : arr[0];
    }

comparisonExpression
    = left:ident right:(_ comparisonOp _ ident)? {
      return right ? { op: right[1], left, right: right[3] } : left;
    }

primary
    = "(" _ expr:expression _ ")" { return expr; }
    / ident:ident { return ident; }

comparisonOp
  = op:[<>=] { return op; }

logicalOr
  = '||' { return ''; }
  / [oO][rR] { return ''; }

logicalAnd
  = '&&' { return ''; }
  / [aA][nN][dD] { return ''; }

ident
  = _ value:'*' { return value; }
  / _ '"' value:[a-zA-Z0-9 ]+ '"' { return value.join(''); }
  / _ "'" value:[a-zA-Z0-9 ]+ "'" { return value.join(''); }
  / _ ident:[a-zA-Z0-9]+ { return ident.join(''); }

_ "whitespace"
  = [ \t\n\r]* { return ''; }
