import {PROJECT} from './lib.mjs';
await import(PROJECT.renderer==='quiz'?'./quiz-stills.mjs':PROJECT.renderer==='education'?'./education-stills.mjs':PROJECT.renderer==='macro'?'./macro-stills.mjs':PROJECT.renderer==='journey'?'./journey-stills.mjs':PROJECT.renderer==='sequel'?'./sequel-stills.mjs':PROJECT.renderer==='trailer'?'./trailer-stills.mjs':'./studio-stills.mjs');
