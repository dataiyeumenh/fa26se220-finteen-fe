import test from 'node:test';
import assert from 'node:assert/strict';
import { chapterFourChoices,chapterFourEndings,chapterFourOutcome } from '../src/pages/User/Dashboard/components/game/chapterFourStory.js';

test('All three choices end in a three-beat story with consistent earnings',()=>{
  assert.equal(chapterFourChoices.length,3);
  for(const choice of chapterFourChoices){
    const ending=chapterFourEndings[choice.id];
    assert.equal(ending.frames.length,3);
    assert.equal(ending.firstPay,choice.cash);
    assert.equal(ending.total,ending.firstPay+ending.laterPay);
    assert.ok(ending.frames.every(f=>f.speaker&&f.when&&f.text&&f.prop));
  }
});
test('Skipping revision stops later shifts and leaves exactly 100,000 in the month',()=>{
  const ending=chapterFourEndings.work;
  assert.equal(ending.grade,4);
  assert.equal(ending.workAllowed,false);
  assert.equal(ending.laterPay,0);
  assert.equal(ending.total,100000);
});
test('Study and negotiated shifts preserve later earnings and return chapter flags',()=>{
  assert.equal(chapterFourEndings.study.total,300000);
  assert.equal(chapterFourEndings.balance.total,340000);
  for(const choice of chapterFourChoices){
    const result=chapterFourOutcome(choice.id);
    assert.equal(result.sceneId,'4.3');
    assert.equal(result.nextSceneId,'4.4');
    assert.equal(result.flags.F_JOB_ROUTE,'event');
    assert.equal(result.monthNet,chapterFourEndings[choice.id].total);
  }
  assert.throws(()=>chapterFourOutcome('missing'));
});
