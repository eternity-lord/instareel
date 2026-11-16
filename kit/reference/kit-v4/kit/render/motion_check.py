#!/usr/bin/env python3
"""Objective 'is it too static/relaxing?' check. Usage: python3 render/motion_check.py [video.mp4]
Writes out/motion-report.txt. FIX every STATIC window >= 1.0 s before you say the reel is done."""
import subprocess,sys,numpy as np,os
v=sys.argv[1] if len(sys.argv)>1 else 'out/nail-reel-01.mp4';W,H,FPS=108,192,10
raw=subprocess.check_output(['ffmpeg','-v','error','-i',v,'-vf',f'fps={FPS},scale={W}:{H},format=gray','-f','rawvideo','-'])
f=np.frombuffer(raw,dtype=np.uint8).reshape(-1,H,W).astype(np.float32)
d=np.abs(np.diff(f,axis=0)).mean(axis=(1,2));n=len(d)
cuts=[i/FPS for i,x in enumerate(d) if x>14]
T=2.0;low=[];i=0;win=int(1.0*FPS)
for i in range(0,max(1,n-win)):
    if d[i:i+win].mean()<1.0:low.append(i/FPS)
segs=[];
for t in low:
    if segs and t-segs[-1][1]<=1.0/FPS*1.5:segs[-1][1]=t
    else:segs.append([t,t])
L=['video: %s  duration: %.1fs'%(v,(n+1)/FPS),'mean motion energy: %.2f (target >= 3.0)'%d.mean(),'hard cuts/whips (jumps): %d (~1 per %.1fs; target 1 per 2-3 s)'%(len(cuts),(n/FPS)/max(1,len(cuts)))]
L+=['STATIC window: %.1fs - %.1fs (motion < 1.0 for >= 1 s)'%(a,b+1) for a,b in segs] or ['no static windows']
os.makedirs('out',exist_ok=True);open('out/motion-report.txt','w').write('\n'.join(L));print('\n'.join(L))
