import {PROJECT} from './lib.mjs';
await import(PROJECT.renderer==='macro'?'./macro-stills.mjs':PROJECT.renderer==='journey'?'./journey-stills.mjs':PROJECT.renderer==='sequel'?'./sequel-stills.mjs':PROJECT.renderer==='trailer'?'./trailer-stills.mjs':'./studio-stills.mjs');
