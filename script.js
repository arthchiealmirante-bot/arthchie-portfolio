const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('portfolio-theme');
if (storedTheme) root.dataset.theme = storedTheme;
themeToggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('portfolio-theme', next);
});

document.getElementById('year').textContent = `© ${new Date().getFullYear()}`;

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded','false');
}));

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.style.transitionDelay = `${el.dataset.delay || 0}ms`;
      el.classList.add('visible');
      revealObs.unobserve(el);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const railLinks = [...document.querySelectorAll('.rail-link')];
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      railLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    }
  });
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s => navObs.observe(s));

const projects = {
  cic: {
    title:'CIC Activity Monitoring System',
    kicker:'Monitoring / Validation / Compliance',
    image:'assets/project-cic.webp',
    overview:'A purpose-built monitoring system for training activity submissions, bringing participant counts, expected activities, validation status, pending submissions, corrections, formatting warnings, and recent responses into one view.',
    problem:'The workflow involves keeping participant counts, expected activities, submissions, validation, corrections, and compliance status visible.',
    solution:'Brings activity and submission information into one monitoring view, with class and subject filters and distinct validation states.',
    features:[
      ['Dashboard visibility','See submission and validation status at a glance.'],
      ['Class + subject filters','Review activity compliance by date, class, or subject.'],
      ['Validation workflow','Separate validated, pending, correction-required, corrected, and warning states.'],
      ['Administrative follow-through','Supports reminders, participant management, submission review, and daily activity encoding.']
    ],
    technologies:'Google Sheets Sync (listed in the project summary).',
    outcome:'A consolidated view of submission and validation status, with support for review and administrative follow-through.'
  },
  fis: {
    title:'FIS Tracker Management',
    kicker:'Investigation support / Link analysis',
    image:'assets/project-fis.webp',
    overview:'An investigation-support interface that brings tracking records, case context, monitoring, link diagrams, mapping, workflow controls, briefing views, and data-quality review together.',
    problem:'Related records, tracking information, monitoring status, and data-quality context need to be reviewed together.',
    solution:'Combines tracking context with relationship views, mapping, workflow controls, and review tools in one interface.',
    features:[
      ['Link visualization','Connects evidence or firearm groups with related cases in a visual relationship map.'],
      ['Tracking intelligence','Surfaces overall status, priority, date span, stations, and related-case context.'],
      ['Case-conference support','Structured views help move from database records to operational discussion.'],
      ['Public-safe preview','Sensitive operational particulars are deliberately obscured in this portfolio.']
    ],
    technologies:'Not specified in the current public project details.',
    outcome:'A structured view of status, priority, related-record context, and review.'
  },
  exam: {
    title:'Examination Management System',
    kicker:'Secure assessment / Monitoring / Results',
    image:'assets/project-exam.webp',
    overview:'A centralized examination administration platform for participants, courses, question banks, examinations, live monitoring, grading, results, retakes, audit trails, and system operations.',
    problem:'Examination administration spans participant and question-bank management, live attempts, grading, results, retakes, audit trails, and system operations.',
    solution:'Centralizes examination administration, monitoring, results, retakes, and audit trails in one workspace.',
    features:[
      ['Live examination monitoring','Tracks enrolled participants, identity confirmation, active attempts, submissions, and disconnections.'],
      ['Results analytics','Summarizes pass/fail outcomes, score distribution, progress, and grading status for rapid review.'],
      ['Administrative controls','Supports question banks, examination setup, retake authorization, exports, and database maintenance.'],
      ['Integrity indicators','Provides connection and focus-alert indicators together with audit logging for examination oversight.']
    ],
    technologies:'Not specified in the current public project details.',
    outcome:'A central workspace for examination administration, monitoring, results, and audit review.'
  }
};

const dialog = document.getElementById('projectDialog');
const dialogBody = document.getElementById('dialogBody');
const closeDialog = document.querySelector('.dialog-close');
function openProject(key){
  const p = projects[key]; if(!p) return;
  dialogBody.innerHTML = `<div class="dialog-inner"><span class="section-index">${p.kicker}</span><h2>${p.title}</h2><section class="case-section case-overview"><h3>Overview</h3><p>${p.overview}</p></section><img src="${p.image}" alt="${p.title} preview"><div class="case-grid"><section class="case-section"><h3>Problem</h3><p>${p.problem}</p></section><section class="case-section"><h3>Solution</h3><p>${p.solution}</p></section><section class="case-section"><h3>Technologies</h3><p>${p.technologies}</p></section><section class="case-section"><h3>Outcome</h3><p>${p.outcome}</p></section></div><section class="case-section case-feature-block"><h3>Key Features</h3><div class="dialog-list">${p.features.map(x=>`<div><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('')}</div></section></div>`;
  dialog.showModal();
}
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', e => { if(!e.target.closest('a')) openProject(card.dataset.project); });
  card.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openProject(card.dataset.project); }});
});
closeDialog?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog) dialog.close();});

// Lightweight animated signal field — no external library or network calls.
const canvas = document.getElementById('signalCanvas');
const ctx = canvas.getContext('2d');
let points=[]; let raf;
function resize(){
  const dpr=Math.min(devicePixelRatio||1,2); canvas.width=innerWidth*dpr; canvas.height=innerHeight*dpr; canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px'; ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=Math.max(22,Math.min(65,Math.floor(innerWidth/28))); points=Array.from({length:count},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.2+.35}));
}
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight); const dark=root.dataset.theme!=='light';
  for(const p of points){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=dark?'rgba(110,190,218,.38)':'rgba(31,105,140,.22)';ctx.fill();}
  for(let i=0;i<points.length;i++) for(let j=i+1;j<points.length;j++){const a=points[i],b=points[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<125){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=dark?`rgba(70,175,165,${(1-d/125)*.08})`:`rgba(35,108,118,${(1-d/125)*.055})`;ctx.stroke();}}
  raf=requestAnimationFrame(draw);
}
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){resize();draw();addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw();});}
