import { division,repeating,finiteDenominators,fraction } from './rules/n07.mjs';
export function completeN07Solutions(){
 const one=repeating('8'),two=repeating('69');
 return {schemaVersion:1,scope:'N07 teacher-only complete mathematical solution; not the learner display order',questions:{
 'N07-Q01':{division:division('3','4'),conclusion:'3/4=0.75; remainder0 at decimal place2'},
 'N07-Q02':{division:division('23','11'),conclusion:'integer2 remainder1; then (digit0,remainder10),(digit9,remainder1)'},
 'N07-Q03':{conclusion:'2.overline(09)',reason:'Same remainder1 recreates the same next two division states.'},
 'N07-Q04':{conclusion:['0.75: terminating decimal, rational','2.overline(09): recurring decimal, rational'],reason:'Both equal ratios of integers with nonzero denominators. Rational is defined before applying it.'},
 'N07-Q05':{assumptions:['positive integer denominator n','negative fractions handled by their sign separately','integer part removed before tracking decimal remainders'],proof:['Remainders belong to0..n-1.','Remainder0 terminates.','If computation continues, only n-1 nonzero remainders are possible.','A repeated remainder gives the same next digit and remainder because integer division is deterministic.','Thus the decimal is terminating or eventually recurring.'],proofStatus:'SOURCE_AND_REASONING_REVIEWED; not formally verified'},
 'N07-Q06':{scale:one.scale,equation:'10x=8.overline(8)',trace:one.trace.filter(t=>['scale','scaled'].includes(t.id))},
 'N07-Q07':{trace:one.trace.filter(t=>['subtract','left-form','coefficient','right-difference'].includes(t.id)),conclusion:'9x=8'},
 'N07-Q08':{trace:one.trace.filter(t=>t.id==='divide'),conclusion:'x=8/9'},
 'N07-Q09':{scale:two.scale,trace:two.trace.filter(t=>['scale','scaled','subtract','left-form','coefficient','right-difference'].includes(t.id)),conclusion:'99x=69'},
 'N07-Q10':{trace:two.trace.filter(t=>['divide','reduce'].includes(t.id)),conclusion:'x=69/99=23/33'},
 'N07-Q11':{assumptions:['k positive integer','reduce rational before considering denominator factors'],proof:['10^k=(2*5)^k=2^k*5^k.','A finite decimal is c/10^k, and reducing it divides its denominator by an integer common divisor, introducing no new prime.','Conversely, let reduced denominator be2^u*5^v, u,v>=0.','Choose h=max(u,v), so h-u,h-v>=0.','Multiply numerator and denominator by2^(h-u)*5^(h-v).','The resulting denominator is2^h*5^h=10^h; the numerator remains an integer.','For denominator1 the number is already an integer.'],conclusion:'A reduced positive denominator has only prime factors2 and5 iff the rational has a terminating decimal.',proofStatus:'SOURCE_AND_REASONING_REVIEWED; not formally verified'},
 'N07-Q12':{allCases:finiteDenominators(2,20),conclusion:finiteDenominators(2,20).filter(c=>c.finite).map(c=>c.a)},
 'N07-Q13':{assumptions:['natural numbers mean positive integers','a=2,b=3'],difference:fraction(2).sub(3).toFraction(),quotient:fraction(2).div(3).toFraction(),conclusion:'Neither is a natural number; these counterexamples refute closure under subtraction/division.'},
 'N07-Q14':{givenResult:'23/33',conclusion:'rational because23 and33 are integers and33 is nonzero',deferredProof:'sqrt(2) irrationality proof belongs to propositions/proof, not claimed proved here',retainedProperties:['real addition/multiplication are commutative and associative','distributive law','division by zero excluded']}
 }};
}
