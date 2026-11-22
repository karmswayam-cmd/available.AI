"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bell, BookOpen,
  Bot, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Clock3,
  Command, CreditCard, FileText, Globe2, Inbox, LayoutDashboard, Link2,
  Loader2, Menu, MessageSquare, MoreHorizontal, Pause, Play, Plus, Search,
  Send, Settings, ShieldCheck, Sparkles, Target, Upload, WandSparkles, X,
  Zap, Instagram, Mail, BarChart3, CalendarDays, Image as ImageIcon, Rocket,
  Users, Workflow, Eye, ExternalLink, PanelLeftClose, RefreshCw, Store
} from "lucide-react";

type Tab = "Overview" | "Chat with AI" | "Build" | "Grow" | "Earn" | "Run" | "Brand" | "Inbox" | "Research" | "Files" | "Integrations" | "Settings";
type Approval = { id:number; title:string; detail:string; channel:string; status:"pending"|"approved"|"rejected"; date:string };
type ActivityItem = { id:number; title:string; detail:string; time:string; state:"done"|"working"|"waiting" };
type Doc = { id:number; title:string; kind:string; body:string; date:string };
type ChatMsg = { role:"user"|"assistant"; content:string };

const navGroups:{title:string;items:{label:Tab;icon:any}[]}[]=[
 {title:"WORKSPACE",items:[{label:"Overview",icon:LayoutDashboard},{label:"Chat with AI",icon:MessageSquare},{label:"Build",icon:Globe2},{label:"Grow",icon:Rocket},{label:"Earn",icon:CreditCard},{label:"Run",icon:Activity}]},
 {title:"BUSINESS",items:[{label:"Brand",icon:Sparkles},{label:"Inbox",icon:Inbox},{label:"Research",icon:Search},{label:"Files",icon:FileText}]},
 {title:"MANAGE",items:[{label:"Integrations",icon:Link2},{label:"Settings",icon:Settings}]}
];

const starterApprovals:Approval[]=[
 {id:1,title:"Welcome email draft",detail:"A first-touch email for new customers. Nothing has been sent.",channel:"Email",status:"pending",date:"Just now"},
 {id:2,title:"Instagram launch post",detail:"A draft announcement introducing your business.",channel:"Social",status:"pending",date:"Today"}
];
const starterActivity:ActivityItem[]=[
 {id:1,title:"Workspace created",detail:"Your available.AI business space is ready",time:"Just now",state:"done"},
 {id:2,title:"Business idea",detail:"Add your idea to give your AI employee context",time:"Next step",state:"waiting"},
 {id:3,title:"First website",detail:"Create a page customers can react to",time:"Not started",state:"waiting"}
];

const ideaExamples=["A booking site for local fitness trainers","An online store for handmade home decor","A simple app to manage freelance projects","A local directory for trusted home services"];

function makePlan(idea:string){
 const subject=idea.trim()||"your business idea";
 return "FIRST BUSINESS PLAN\n\nTHE IDEA\n"+subject+"\n\nWHO IT IS FOR\nChoose one clear customer group. Describe their current situation, what they struggle with and what they already pay for.\n\nTHE PROBLEM\nValidate that this is frequent, painful and important enough to act on. Speak to five potential customers before building too much.\n\nTHE FIRST OFFER\nCreate the smallest useful version someone can try or buy. State what is included, how long it takes and what it costs.\n\nHOW TO FIND CUSTOMERS\nStart with direct conversations, relevant communities, partnerships and one focused content channel.\n\n30-DAY PLAN\nWeek 1 — Interview customers and review alternatives.\nWeek 2 — Shape the offer and build a simple landing page.\nWeek 3 — Invite early users and ask for feedback.\nWeek 4 — Review conversion, costs and customer response; improve one thing.\n\nFIRST SUCCESS SIGNAL\nA qualified customer takes a concrete step: books a call, joins a waitlist, requests a quote or pays.\n\nNEXT ACTION\nTalk to one potential customer today.";
}
function makeWebsite(name:string,offer:string){
 return (name||"Your brand")+"\n"+(offer||"A better way to get the result you need.")+"\n\nABOUT\nWe help people solve a real problem with a clear, thoughtful service. Our process is simple, our communication is direct and our focus is on useful outcomes.\n\nWHAT WE OFFER\nA focused service designed around customer needs. Tell visitors what is included, who it is for and what happens next.\n\nWHY CHOOSE US\n• Clear expectations\n• A practical process\n• Support focused on outcomes\n\nCALL TO ACTION\nReady to take the next step? Get in touch and tell us what you are working towards.";
}
function makePost(idea:string){
 return "SOCIAL LAUNCH DRAFT\n\nBig things start with a first step.\n\nWe are building something for people who want a better way to "+(idea||"get things done")+". We are starting small, listening closely and making it better with every conversation.\n\nWhat is the one thing you wish was easier?\n\n#smallbusiness #buildinginpublic #newlaunch";
}

export default function Home(){
 const [tab,setTab]=useState<Tab>("Overview");
 const [mobile,setMobile]=useState(false);
 const [idea,setIdea]=useState("");
 const [business,setBusiness]=useState("");
 const [offer,setOffer]=useState("");
 const [messages,setMessages]=useState<ChatMsg[]>([{role:"assistant",content:"Hi, I'm your available.AI operator. Tell me what you're building, what feels stuck, or what you want to get done. I'll help turn it into a practical next step."}]);
 const [chat,setChat]=useState("");
 const [thinking,setThinking]=useState(false);
 const [aiMode,setAiMode]=useState("Guided demo mode");
 const [approvals,setApprovals]=useState<Approval[]>(starterApprovals);
 const [activity,setActivity]=useState<ActivityItem[]>(starterActivity);
 const [docs,setDocs]=useState<Doc[]>([]);
 const [selectedDoc,setSelectedDoc]=useState<Doc|null>(null);
 const [notice,setNotice]=useState("");
 const [showOnboarding,setShowOnboarding]=useState(false);
 const [onboardingStep,setOnboardingStep]=useState(0);
 const [websiteView,setWebsiteView]=useState("desktop");
 const [websiteDraft,setWebsiteDraft]=useState("");
 const [websiteName,setWebsiteName]=useState("");
 const [websiteOffer,setWebsiteOffer]=useState("");
 const [runOn,setRunOn]=useState(false);
 const [runBudget,setRunBudget]=useState(10);
 const [runLog,setRunLog]=useState<ActivityItem[]>([]);
 const [connected,setConnected]=useState<string[]>([]);
 const [brandColor,setBrandColor]=useState("#7868e6");
 const [search,setSearch]=useState("");
 const [showAllActivity,setShowAllActivity]=useState(false);

 useEffect(()=>{
  try{
   const raw=localStorage.getItem("available-workspace-v2");
   if(raw){
    const d=JSON.parse(raw);
    if(d.idea)setIdea(d.idea); if(d.business)setBusiness(d.business); if(d.offer)setOffer(d.offer);
    if(d.messages)setMessages(d.messages); if(d.approvals)setApprovals(d.approvals);
    if(d.activity)setActivity(d.activity); if(d.docs)setDocs(d.docs);
    if(d.connected)setConnected(d.connected); if(d.brandColor)setBrandColor(d.brandColor);
    if(d.runLog)setRunLog(d.runLog);
   }
  }catch{}
 },[]);
 useEffect(()=>{
  try{localStorage.setItem("available-workspace-v2",JSON.stringify({idea,business,offer,messages,approvals,activity,docs,connected,brandColor,runLog}));}catch{}
 },[idea,business,offer,messages,approvals,activity,docs,connected,brandColor,runLog]);

 const pending=approvals.filter(a=>a.status==="pending").length;
 const complete=activity.filter(a=>a.state==="done").length;
 const progress=Math.round(complete/Math.max(activity.length,1)*100);
 const toast=(s:string)=>{setNotice(s);window.setTimeout(()=>setNotice(""),2600);};
 const addActivity=(title:string,detail:string,state:"done"|"working"|"waiting"="done")=>{
  setActivity(old=>[{id:Date.now(),title,detail,time:"Just now",state},...old]);
 };
 const saveDoc=(title:string,kind:string,body:string)=>{
  const d={id:Date.now(),title,kind,body,date:new Date().toLocaleDateString()};
  setDocs(old=>[d,...old]);setSelectedDoc(d);toast("Saved to your workspace");
 };
 const generatePlan=()=>{const body=makePlan(idea);saveDoc("First business plan","Plan",body);addActivity("Business plan drafted","A first plan is ready to review");};
 const generateSite=()=>{const body=makeWebsite(websiteName||business,websiteOffer||offer);setWebsiteDraft(body);saveDoc("Website first draft","Website",body);addActivity("Website copy drafted","Review the first version before publishing");};
 const generatePost=()=>{const body=makePost(offer||idea);saveDoc("Launch social post","Social draft",body);addActivity("Social post drafted","Waiting for your approval before publishing","waiting");setApprovals(old=>[{id:Date.now(),title:"Launch social post",detail:"A launch announcement drafted for your audience.",channel:"Social",status:"pending",date:"Just now"},...old]);};
 const decide=(id:number,status:"approved"|"rejected")=>{
  setApprovals(old=>old.map(a=>a.id===id?{...a,status}:a));
  const item=approvals.find(a=>a.id===id);
  addActivity((status==="approved"?"Approved: ":"Declined: ")+(item?.title||"Draft"),"Decision recorded. External delivery is not connected in this workspace.");
  toast(status==="approved"?"Approved in workspace":"Draft declined");
 };
 const sendMessage=async()=>{
  const q=chat.trim();if(!q||thinking)return;
  const next=[...messages,{role:"user" as const,content:q}];setMessages(next);setChat("");setThinking(true);
  try{
   const r=await fetch("/api/assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:next,businessContext:{name:business,idea,offer}})});
   const data=await r.json();
   if(r.ok&&data.reply){setMessages(old=>[...old,{role:"assistant",content:data.reply}]);setAiMode("Connected AI");}
   else throw new Error(data.error||"AI provider not configured");
  }catch{
   const response="I can help you move this forward. Based on what you've shared, I'd start by making the customer and outcome specific, then create one small thing to test this week. Add more detail about your audience or offer and I can shape a practical plan. (Guided demo mode — connect an AI API key to enable live AI responses.)";
   setMessages(old=>[...old,{role:"assistant",content:response}]);setAiMode("Guided demo mode");
  }finally{setThinking(false);}
 };
 const startRun=()=>{
  if(runOn){setRunOn(false);toast("Run paused");return;}
  setRunOn(true);
  const item={id:Date.now(),title:"Run started",detail:"Your operator is preparing the next useful business task. No external actions will be sent without approval.",time:"Just now",state:"working" as const};
  setRunLog(old=>[item,...old]);addActivity("Run started","A bounded work session has started","working");toast("Run started");
 };
 const filteredDocs=useMemo(()=>docs.filter(d=>(d.title+" "+d.kind).toLowerCase().includes(search.toLowerCase())),[docs,search]);

 const pageHeader=(eyebrow:string,title:string,desc:string,action?:React.ReactNode)=><div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>;
 const cardTitle=(eyebrow:string,title:string,extra?:React.ReactNode)=><div className="card-title"><div><div className="eyebrow">{eyebrow}</div><h3>{title}</h3></div>{extra}</div>;

 function overview(){
  return <>{pageHeader("YOUR BUSINESS, IN ONE PLACE","Make your idea happen.","Your AI operator helps you plan, build, reach customers and earn.",<button className="btn btn-primary" onClick={()=>setTab("Chat with AI")}><Sparkles size={16}/> Talk to your AI <ArrowRight size={15}/></button>)}
   <section className="hero-panel"><div className="hero-copy"><span className="hero-kicker"><span className="live-dot"/> YOUR AI BUSINESS OPERATOR</span><h2>From first idea<br/>to <em>first customer.</em></h2><p>Tell available.AI what you're building. Your operator turns the idea into a plan, creates the first version and helps you find the people who need it.</p><div className="hero-actions"><button className="btn btn-white" onClick={()=>setTab("Chat with AI")}>Start a conversation <ArrowRight size={16}/></button><button className="hero-link" onClick={()=>setTab("Build")}>Explore Build <ChevronRight size={15}/></button></div></div><div className="hero-visual"><div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/><div className="hero-glow"><Bot size={38}/></div><div className="hero-float float-top"><CheckCircle2 size={15}/> Plan ready</div><div className="hero-float float-bottom"><Sparkles size={15}/> Your next move</div></div></section>
   <div className="stats-row"><div className="stat-card"><span>Business progress</span><strong>{progress}%</strong><div className="progress-line"><i style={{width:progress+"%"}}/></div><small>{complete} completed actions</small></div><div className="stat-card"><span>Needs your approval</span><strong>{pending}</strong><small>Drafts waiting for your review</small><button className="stat-link" onClick={()=>setTab("Inbox")}>Review drafts <ArrowUpRight size={14}/></button></div><div className="stat-card"><span>Workspace files</span><strong>{docs.length}</strong><small>Plans, pages and campaigns</small><button className="stat-link" onClick={()=>setTab("Files")}>Open files <ArrowUpRight size={14}/></button></div><div className="stat-card"><span>Operator status</span><strong className="status-word">{runOn?"Working":"Ready"}</strong><small>{runOn?"A work session is active":"Waiting for your direction"}</small><button className="stat-link" onClick={()=>setTab("Run")}>View activity <ArrowUpRight size={14}/></button></div></div>
   <div className="three-steps"><button className="step-card" onClick={()=>setTab("Build")}><span className="step-icon violet"><Globe2 size={19}/></span><span className="step-meta">01 · BUILD</span><b>Make something real</b><small>Plan your product and create your first website.</small><span className="step-arrow"><ArrowUpRight size={16}/></span></button><button className="step-card" onClick={()=>setTab("Grow")}><span className="step-icon orange"><Rocket size={19}/></span><span className="step-meta">02 · GROW</span><b>Find your customers</b><small>Research your market and prepare outreach.</small><span className="step-arrow"><ArrowUpRight size={16}/></span></button><button className="step-card" onClick={()=>setTab("Earn")}><span className="step-icon green"><CreditCard size={19}/></span><span className="step-meta">03 · EARN</span><b>Build a way to earn</b><small>Shape your offer, pricing and payment path.</small><span className="step-arrow"><ArrowUpRight size={16}/></span></button></div>
   <div className="overview-grid"><section className="surface">{cardTitle("YOUR OPERATOR","Recent activity",<button className="text-link" onClick={()=>setTab("Run")}>View all <ArrowRight size={13}/></button>)}<div className="timeline">{(showAllActivity?activity:activity.slice(0,4)).map(a=><div className="timeline-row" key={a.id}><span className={"timeline-dot "+a.state}>{a.state==="done"?<Check size={12}/>:a.state==="working"?<Loader2 size={12}/>:<Clock3 size={12}/>}</span><div><b>{a.title}</b><small>{a.detail}</small></div><time>{a.time}</time></div>)}</div><button className="show-more" onClick={()=>setShowAllActivity(!showAllActivity)}>{showAllActivity?"Show less":"Show all activity"} <ChevronDown size={13}/></button></section>
    <section className="surface assistant-card">{cardTitle("YOUR AI EMPLOYEE","What should we work on?")}<div className="assistant-preview"><div className="operator-avatar"><Bot size={19}/></div><div><b>available.AI operator</b><small>{aiMode}</small></div><span className="live-dot"/></div><p className="assistant-prompt">Tell me your idea, ask a question or give me a task. We'll figure out the next useful move together.</p><button className="btn btn-primary wide" onClick={()=>setTab("Chat with AI")}>Open conversation <MessageSquare size={15}/></button><div className="assistant-foot"><ShieldCheck size={14}/> You approve external actions before they go out.</div></section></div>
  </>;
 }

 function chatPage(){
  return <>{pageHeader("YOUR AI EMPLOYEE","Work with your operator.","One conversation for your business plan, website, customers and next steps.",<span className="mode-pill"><span className="live-dot"/>{aiMode}</span>)}
   <div className="chat-layout"><section className="surface chat-main"><div className="chat-top"><div className="operator-avatar large"><Bot size={22}/></div><div><b>available.AI operator</b><small>Business planning · Build · Grow · Earn</small></div><button className="icon-btn" onClick={()=>setMessages([{role:"assistant",content:"Fresh start. What are you building?"}])}><RefreshCw size={15}/></button></div><div className="chat-messages">{messages.map((m,i)=><div className={"message "+m.role} key={i}><div className="message-avatar">{m.role==="assistant"?<Bot size={15}/>:<span>Y</span>}</div><div className="message-bubble"><span className="message-name">{m.role==="assistant"?"available.AI":"You"}</span><p>{m.content}</p></div></div>)}{thinking&&<div className="message assistant"><div className="message-avatar"><Bot size={15}/></div><div className="message-bubble"><span className="typing"><i/><i/><i/></span></div></div>}</div><form className="chat-composer" onSubmit={e=>{e.preventDefault();sendMessage();}}><textarea rows={2} value={chat} onChange={e=>setChat(e.target.value)} placeholder="Tell me what you want to build or get done..." onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}/><div className="composer-bottom"><span><Sparkles size={13}/> Your operator can help with any part of your business</span><button className="btn btn-primary" type="submit" disabled={thinking||!chat.trim()}><Send size={15}/> Send</button></div></form></section><aside className="surface context-panel">{cardTitle("BUSINESS CONTEXT","What I know so far")}<label>Business name</label><input value={business} onChange={e=>setBusiness(e.target.value)} placeholder="Your business name"/><label>Your idea</label><textarea rows={4} value={idea} onChange={e=>setIdea(e.target.value)} placeholder="What are you building?"/><label>Your offer</label><textarea rows={3} value={offer} onChange={e=>setOffer(e.target.value)} placeholder="What will customers get?"/><div className="context-note"><ShieldCheck size={15}/> Context is saved in this browser.</div><button className="btn btn-secondary wide" onClick={()=>setTab("Build")}>Turn this into a plan <ArrowRight size={14}/></button></aside></div>
  </>;
 }

 function buildPage(){
  return <>{pageHeader("BUILD","Create your first product.","Go from a rough idea to a website, app or store people can try.",<button className="btn btn-secondary" onClick={()=>setTab("Chat with AI")}><MessageSquare size={15}/> Ask operator</button>)}
   <div className="build-grid"><section className="surface build-form">{cardTitle("START WITH A PROMPT","What should we build?")}<p className="muted">Describe the customer, what they need to do and what a useful first version should make possible.</p><label>Business or project name</label><input value={websiteName} onChange={e=>setWebsiteName(e.target.value)} placeholder="e.g. Northstar Studio"/><label>Describe your product</label><textarea rows={5} value={idea} onChange={e=>setIdea(e.target.value)} placeholder="I want to build a website that helps..."/><label>What do you offer?</label><input value={websiteOffer} onChange={e=>setWebsiteOffer(e.target.value)} placeholder="e.g. Online bookings and consultations"/><div className="prompt-chips">{ideaExamples.map(x=><button key={x} onClick={()=>setIdea(x)}>{x}</button>)}</div><button className="btn btn-primary wide" onClick={generatePlan}><WandSparkles size={16}/> Create my first plan <ArrowRight size={15}/></button><button className="btn btn-secondary wide" onClick={generateSite}><Globe2 size={15}/> Draft website copy</button></section>
    <section className="surface build-preview">{cardTitle("LIVE PREVIEW","Your first website",<div className="view-switch"><button className={websiteView==="desktop"?"selected":""} onClick={()=>setWebsiteView("desktop")}><Globe2 size={13}/></button><button className={websiteView==="mobile"?"selected":""} onClick={()=>setWebsiteView("mobile")}><Menu size={13}/></button></div>)}<div className={"browser-frame "+websiteView}><div className="browser-bar"><i/><i/><i/><span>your-business.available.site</span></div><div className="website-mock"><div className="mock-nav"><b>{websiteName||business||"Your brand"}</b><span>Home　 About　 Contact</span></div><div className="mock-hero"><span>WELCOME</span><h2>{websiteOffer||offer||"Make your next big idea happen."}</h2><p>A clear offer. A thoughtful experience. A better way forward.</p><button>Get started <ArrowRight size={12}/></button></div><div className="mock-cards"><i/><i/><i/></div></div></div><div className="preview-note"><ShieldCheck size={14}/> Draft preview only. Nothing is published.</div><button className="btn btn-secondary wide" onClick={()=>setTab("Files")}>View saved drafts <ArrowRight size={14}/></button></section></div>
   <div className="feature-strip"><div><CheckCircle2 size={17}/><span><b>Review before publish</b><small>You stay in control of what goes live.</small></span></div><div><RefreshCw size={17}/><span><b>Version history</b><small>Keep drafts and revisit previous versions.</small></span></div><div><Store size={17}/><span><b>Multiple product types</b><small>Websites, landing pages, stores and apps.</small></span></div></div>
  </>;
 }

 function growPage(){
  return <>{pageHeader("GROW","Find the people who need you.","Research your market, prepare campaigns and create outreach you can review.",<button className="btn btn-primary" onClick={generatePost}><Plus size={15}/> New social draft</button>)}
   <div className="growth-grid"><section className="surface">{cardTitle("MARKET RESEARCH","Understand your audience")}<p className="muted">Start with a clear market question. Add your idea and create a research brief to investigate.</p><label>What do you want to learn?</label><textarea rows={4} value={idea} onChange={e=>setIdea(e.target.value)} placeholder="Who needs this? What alternatives do they use? What do competitors charge?"/><button className="btn btn-primary wide" onClick={()=>saveDoc("Market research brief","Research","MARKET RESEARCH BRIEF\n\nQuestion\n"+(idea||"Understand the target market")+"\n\nInvestigate\n• Target customer groups and unmet needs\n• Existing alternatives and competitor positioning\n• Typical pricing and purchase triggers\n• Communities and channels where buyers spend time\n\nEvidence to collect\nRecord source URLs, publication dates, direct observations and open questions. Validate conclusions with customer interviews.")}><Search size={15}/> Create research brief</button></section>
    <section className="surface">{cardTitle("CAMPAIGNS","Create a social post")}<p className="muted">Prepare content for the channels you use. Review every draft before it is sent or published.</p><div className="channel-row"><span className="channel-icon"><Instagram size={17}/></span><span><b>Instagram</b><small>Post draft · approval required</small></span><span className="channel-status">Draft ready</span></div><div className="channel-row"><span className="channel-icon linkedin">in</span><span><b>LinkedIn</b><small>Post draft · approval required</small></span><span className="channel-status">Not connected</span></div><button className="btn btn-primary wide" onClick={generatePost}><WandSparkles size={15}/> Draft launch post</button></section></div>
   <section className="surface outreach-panel">{cardTitle("CUSTOMER OUTREACH","Build a thoughtful first-touch email")}<div className="outreach-fields"><div><label>Who are you reaching?</label><input placeholder="e.g. Independent retailers"/></div><div><label>What are you offering?</label><input value={offer} onChange={e=>setOffer(e.target.value)} placeholder="Describe your offer"/></div></div><button className="btn btn-secondary" onClick={()=>saveDoc("Customer outreach email","Email","SUBJECT: A quick idea for your business\n\nHi there,\n\nI noticed your work and wanted to reach out. I am building "+(offer||"a service to help businesses improve their workflow")+".\n\nWould it be useful if I shared a short overview? No pressure either way.\n\nBest,\n"+(business||"Your name"))}><Mail size={15}/> Draft outreach email</button><span className="muted tiny">No emails are sent from this workspace.</span></section>
  </>;
 }

 function earnPage(){
  return <>{pageHeader("EARN","Turn value into revenue.","Shape your offer, test a price and map a simple path to your first payment.")}
   <div className="earn-grid"><section className="surface">{cardTitle("YOUR FIRST OFFER","What will customers pay for?")}<label>Offer name</label><input value={offer} onChange={e=>setOffer(e.target.value)} placeholder="e.g. Starter consultation"/><label>Who is it for?</label><input placeholder="Describe your ideal customer"/><label>What result do they get?</label><textarea rows={3} placeholder="Describe the outcome, deliverables and timeframe"/><label>Price hypothesis</label><div className="price-input"><span>$</span><input type="number" placeholder="49"/></div><button className="btn btn-primary wide" onClick={()=>saveDoc("First offer and pricing test","Offer","OFFER HYPOTHESIS\n\nOffer: "+(offer||"First offer")+"\n\nCustomer\nDefine one buyer and the problem they want solved.\n\nOutcome\nDescribe the specific result and what is included.\n\nPrice test\nTreat your first price as a hypothesis. Compare alternatives, speak to buyers and test willingness to pay.\n\nFirst money experiment\nInvite five qualified prospects to review the offer. Record objections, intent and actual purchases.")}><Sparkles size={15}/> Create offer brief</button></section>
    <section className="surface earn-path">{cardTitle("PAYMENT PATH","How you get paid")}<div className="path-step"><span>1</span><div><b>Make the offer clear</b><small>Customer understands what they get.</small></div></div><div className="path-line"/><div className="path-step"><span>2</span><div><b>Choose a checkout</b><small>Connect a payment provider when ready.</small></div></div><div className="path-line"/><div className="path-step"><span>3</span><div><b>Deliver the result</b><small>Confirm payment and fulfill the order.</small></div></div><div className="payment-warning"><ShieldCheck size={16}/> Payments are not connected. No money can be collected from this demo workspace.</div><button className="btn btn-secondary wide" onClick={()=>setTab("Integrations")}>Explore integrations <ArrowRight size={14}/></button></section></div>
  </>;
 }

 function runPage(){
  return <>{pageHeader("AUTOPILOT","Let your operator keep moving.","Run a bounded work session. Review its activity and approve anything that would affect the outside world.",<span className={"run-status "+(runOn?"running":"")}>{runOn?<><span className="live-dot"/> Running</>:"Paused"}</span>)}
   <div className="run-grid"><section className="surface run-control">{cardTitle("WORK SESSION","Your business, moving forward")}<p className="muted">Your operator can prepare website improvements, research competitors, draft outreach and suggest content. External actions remain behind approval.</p><div className="run-budget"><div><span>Session budget</span><b>{runBudget} credits</b></div><input type="range" min="1" max="50" value={runBudget} onChange={e=>setRunBudget(Number(e.target.value))}/><div className="budget-labels"><small>1 credit</small><small>50 credits</small></div></div><button className={"btn "+(runOn?"btn-secondary":"btn-primary")+" wide"} onClick={startRun}>{runOn?<><Pause size={16}/> Pause session</>:<><Play size={16}/> Start work session</>}</button><div className="run-safety"><ShieldCheck size={16}/> Your approval is required before anything is sent, published or charged.</div></section>
    <section className="surface">{cardTitle("LIVE ACTIVITY","What your operator is doing")}<div className="timeline">{(runLog.length?runLog:activity).slice(0,6).map(a=><div className="timeline-row" key={a.id}><span className={"timeline-dot "+a.state}>{a.state==="done"?<Check size={12}/>:a.state==="working"?<Loader2 size={12}/>:<Clock3 size={12}/>}</span><div><b>{a.title}</b><small>{a.detail}</small></div><time>{a.time}</time></div>)}</div>{!runLog.length&&<div className="empty-inline">Start a session to create a run log.</div>}</section></div>
   <section className="surface"><div className="run-permissions">{cardTitle("GUARDRAILS","What needs your approval")}<div className="permission-row"><span><Mail size={16}/> Emails and outreach</span><b>Always ask</b></div><div className="permission-row"><span><Instagram size={16}/> Social posts</span><b>Always ask</b></div><div className="permission-row"><span><Globe2 size={16}/> Website publishing</span><b>Always ask</b></div><div className="permission-row"><span><CreditCard size={16}/> Payments and spending</span><b>Never automatic</b></div></div></section>
  </>;
 }

 function brandPage(){
  return <>{pageHeader("BRAND STUDIO","Give your business a consistent identity.","Set your name, voice and visual direction. Use them across every customer touchpoint.")}
   <div className="brand-grid"><section className="surface">{cardTitle("BRAND BASICS","Your identity")}<label>Business name</label><input value={business} onChange={e=>setBusiness(e.target.value)} placeholder="Your business name"/><label>Brand promise</label><input value={offer} onChange={e=>setOffer(e.target.value)} placeholder="What do you help people achieve?"/><label>Primary brand color</label><div className="color-picker"><input type="color" value={brandColor} onChange={e=>setBrandColor(e.target.value)}/><code>{brandColor}</code></div><button className="btn btn-primary wide" onClick={()=>saveDoc("Brand guidelines","Brand","BRAND GUIDELINES\n\nName: "+(business||"Your brand")+"\nPromise: "+(offer||"Define your promise")+"\nPrimary color: "+brandColor+"\n\nVoice\nClear, helpful, confident and human.\n\nWriting principles\n• Lead with the customer's outcome\n• Prefer specific language over hype\n• Keep calls to action simple\n• Be consistent across channels")}>Save brand guidelines</button></section><section className="surface brand-preview"><div className="eyebrow">BRAND PREVIEW</div><div className="brand-swatch" style={{background:brandColor}}><Sparkles size={26}/></div><h2>{business||"Your business"}</h2><p>{offer||"Your promise goes here."}</p><button style={{background:brandColor}}>Get started <ArrowRight size={13}/></button></section></div>
  </>;
 }

 function inboxPage(){
  return <>{pageHeader("APPROVAL CENTER","Your review queue.","Nothing goes out without your say-so. Review each draft and make the final call.",<span className="count-pill">{pending} pending</span>)}
   <div className="approval-list">{approvals.map(a=><article className="surface approval-card" key={a.id}><div className="approval-icon">{a.channel==="Email"?<Mail size={19}/>:<Instagram size={19}/>}</div><div className="approval-body"><div className="approval-meta"><span>{a.channel}</span><time>{a.date}</time></div><h3>{a.title}</h3><p>{a.detail}</p><div className="approval-actions">{a.status==="pending"?<><button className="btn btn-primary" onClick={()=>decide(a.id,"approved")}><Check size={14}/> Approve</button><button className="btn btn-secondary" onClick={()=>decide(a.id,"rejected")}><X size={14}/> Decline</button></>:<span className={"decision "+a.status}>{a.status==="approved"?"Approved":"Declined"} · Recorded locally</span>}</div></div><span className={"approval-state "+a.status}>{a.status==="pending"?"Needs review":a.status}</span></article>)}{!approvals.length&&<div className="surface empty-state"><Inbox size={26}/><h3>All caught up</h3><p>New drafts will appear here when your operator prepares them.</p></div>}</div>
  </>;
 }

 function researchPage(){
  return <>{pageHeader("RESEARCH","Make decisions with evidence.","Create research briefs, collect sources and turn findings into practical next steps.")}
   <div className="surface research-box">{cardTitle("RESEARCH BRIEF","What do you need to know?")}<textarea rows={5} value={idea} onChange={e=>setIdea(e.target.value)} placeholder="e.g. Research the market for online tutoring in my city, including customer segments, competitor prices and acquisition channels."/><div className="research-options"><span><Search size={14}/> Market landscape</span><span><Users size={14}/> Customer segments</span><span><Target size={14}/> Competitors</span><span><BarChart3 size={14}/> Pricing</span></div><button className="btn btn-primary" onClick={()=>saveDoc("Research brief","Research","RESEARCH BRIEF\n\nQuestion\n"+(idea||"Market and customer research")+"\n\nResearch areas\n1. Customer groups and jobs to be done\n2. Existing products and competitors\n3. Pricing models and purchase behavior\n4. Distribution and acquisition channels\n5. Risks, assumptions and unanswered questions\n\nEvidence standard\nAttach source links and dates. Separate facts from hypotheses. Validate with customer conversations before committing resources.")}><WandSparkles size={15}/> Create research brief</button></div>
   <section className="surface">{cardTitle("RECENT RESEARCH","Saved briefs")}<div className="simple-list">{docs.filter(d=>d.kind==="Research").map(d=><button key={d.id} onClick={()=>setSelectedDoc(d)}><FileText size={16}/><span>{d.title}</span><ChevronRight size={15}/></button>)}{!docs.some(d=>d.kind==="Research")&&<div className="empty-inline">Your research briefs will appear here.</div>}</div></section>
  </>;
 }

 function filesPage(){
  return <>{pageHeader("YOUR FILES","Everything you've made.","Plans, website drafts, research, campaigns and brand documents in one place.",<span className="count-pill">{docs.length} files</span>)}
   <div className="surface files-panel"><div className="file-toolbar"><div className="search-field"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search files"/></div><button className="btn btn-secondary" onClick={()=>saveDoc("Untitled note","Note","New workspace note\n\nAdd your thoughts here.")}><Plus size={15}/> New note</button></div>{filteredDocs.length?<div className="file-list">{filteredDocs.map(d=><button className="file-row" key={d.id} onClick={()=>setSelectedDoc(d)}><span className="file-icon"><FileText size={18}/></span><span><b>{d.title}</b><small>{d.kind} · {d.date}</small></span><ChevronRight size={16}/></button>)}</div>:<div className="empty-state"><div className="empty-file"><FileText size={24}/></div><h3>No files yet</h3><p>Create a plan, website draft or campaign. Your work will be collected here.</p><button className="btn btn-primary" onClick={()=>setTab("Build")}>Create your first draft <ArrowRight size={14}/></button></div>}</div>
   {selectedDoc&&<div className="modal-backdrop" onClick={()=>setSelectedDoc(null)}><div className="doc-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">{selectedDoc.kind}</div><h2>{selectedDoc.title}</h2></div><button className="icon-btn" onClick={()=>setSelectedDoc(null)}><X size={17}/></button></div><pre>{selectedDoc.body}</pre><div className="modal-actions"><button className="btn btn-secondary" onClick={()=>{navigator.clipboard?.writeText(selectedDoc.body);toast("Copied");}}><FileText size={14}/> Copy text</button><button className="btn btn-primary" onClick={()=>setSelectedDoc(null)}>Done</button></div></div></div>}
  </>;
 }

 const integrationGroups=[
  {name:"Email & calendar",items:[{name:"Gmail",desc:"Read and draft customer email",icon:Mail},{name:"Google Calendar",desc:"Meetings and appointments",icon:CalendarDays}]},
  {name:"Documents & work",items:[{name:"Google Drive",desc:"Store and organize files",icon:FileText},{name:"Notion",desc:"Notes and knowledge",icon:BookOpen},{name:"Slack",desc:"Team messages",icon:MessageSquare}]},
  {name:"Customers & payments",items:[{name:"HubSpot",desc:"Contacts and deals",icon:Users},{name:"Stripe",desc:"Customer payments",icon:CreditCard}]},
  {name:"Social channels",items:[{name:"Instagram",desc:"Draft and publish posts",icon:Instagram},{name:"LinkedIn",desc:"Reach your professional audience",icon:Users}]}
 ];
 function integrationsPage(){
  return <>{pageHeader("CONNECTED APPS","Bring your tools together.","Connect the services your business uses. These demo connection controls do not authorize external access.")}
   <div className="integration-groups">{integrationGroups.map(g=><section className="surface" key={g.name}>{cardTitle("INTEGRATIONS",g.name)}<div className="integration-list">{g.items.map(item=>{const I=item.icon;const yes=connected.includes(item.name);return <div className="integration-row" key={item.name}><span className="integration-icon"><I size={18}/></span><span className="integration-desc"><b>{item.name}</b><small>{item.desc}</small></span><button className={"connect-btn "+(yes?"connected":"")} onClick={()=>{setConnected(old=>yes?old.filter(x=>x!==item.name):[...old,item.name]);toast(yes?"Disconnected in demo":"Marked connected in demo");}}>{yes?<><Check size={13}/> Connected</>:"Connect"}</button></div>;})}</div></section>)}</div>
   <div className="integration-disclaimer"><ShieldCheck size={17}/> Real OAuth credentials and provider permissions must be configured before these integrations can access accounts or take actions.</div>
  </>;
 }

 function settingsPage(){
  return <>{pageHeader("SETTINGS","Your workspace preferences.","Manage your business context, operator permissions and workspace data.")}
   <div className="settings-grid"><section className="surface">{cardTitle("WORKSPACE","Business profile")}<label>Workspace name</label><input value={business} onChange={e=>setBusiness(e.target.value)} placeholder="My business"/><label>Business description</label><textarea rows={4} value={idea} onChange={e=>setIdea(e.target.value)} placeholder="What does your business do?"/><label>Primary offer</label><input value={offer} onChange={e=>setOffer(e.target.value)} placeholder="Your main product or service"/></section><section className="surface">{cardTitle("SAFETY","Operator permissions")}<div className="setting-line"><div><b>Approval before sending</b><small>Emails, posts and outreach always wait for review.</small></div><span className="toggle on"><i/></span></div><div className="setting-line"><div><b>Approval before publishing</b><small>Website changes remain drafts until approved.</small></div><span className="toggle on"><i/></span></div><div className="setting-line"><div><b>Automatic spending</b><small>Disabled. No payments or ad spend can be triggered.</small></div><span className="toggle"><i/></span></div></section><section className="surface danger-zone">{cardTitle("DATA","Workspace data")}<p className="muted">Your current workspace data is stored in this browser's local storage. It is not synced to a user account or database.</p><button className="btn btn-danger" onClick={()=>{if(confirm("Clear all saved available.AI workspace data from this browser?")){localStorage.removeItem("available-workspace-v2");window.location.reload();}}}>Clear local workspace data</button></section></div>
  </>;
 }

 const pages:Record<Tab,()=>React.ReactNode>={"Overview":overview,"Chat with AI":chatPage,"Build":buildPage,"Grow":growPage,"Earn":earnPage,"Run":runPage,"Brand":brandPage,"Inbox":inboxPage,"Research":researchPage,"Files":filesPage,"Integrations":integrationsPage,"Settings":settingsPage};

 return <main className="app-shell"><aside className={"sidebar "+(mobile?"open":"")}><div className="brand"><div className="brand-symbol"><span/></div><span>available<span className="brand-accent">.AI</span></span><button className="mobile-close" onClick={()=>setMobile(false)}><X size={18}/></button></div><button className="workspace-switch" onClick={()=>setTab("Settings")}><span className="workspace-avatar">{(business||"A").charAt(0).toUpperCase()}</span><span><b>{business||"My workspace"}</b><small>Personal workspace</small></span><ChevronDown size={15}/></button>{navGroups.map(g=><div className="nav-group" key={g.title}><div className="nav-label">{g.title}</div>{g.items.map(item=>{const I=item.icon;return <button key={item.label} className={"nav-item "+(tab===item.label?"active":"")} onClick={()=>{setTab(item.label);setMobile(false);}}><I size={17}/><span>{item.label}</span>{item.label==="Inbox"&&pending>0&&<small className="nav-count">{pending}</small>}</button>;})}</div>)}<div className="sidebar-bottom"><div className="sidebar-run"><div className="run-mini"><Bot size={17}/></div><div><b>AI operator</b><small>{runOn?"Working now":"Ready when you are"}</small></div><span className="live-dot"/></div><div className="profile-row"><div className="profile-avatar">Y</div><div><b>Workspace owner</b><small>Free workspace</small></div><button onClick={()=>setTab("Settings")}><MoreHorizontal size={18}/></button></div></div></aside>{mobile&&<button className="mobile-scrim" onClick={()=>setMobile(false)} aria-label="Close menu"/>}
  <div className="main-area"><header className="topbar"><div className="top-left"><button className="mobile-menu icon-btn" onClick={()=>setMobile(true)}><Menu size={19}/></button><span>Workspace</span><ChevronRight size={14}/><b>{tab}</b></div><div className="top-right"><span className="top-status"><span className="live-dot"/> Operator ready</span><button className="icon-btn notification-btn" onClick={()=>setTab("Inbox")} aria-label="Approvals"><Bell size={17}/>{pending>0&&<i/>}</button><button className="top-avatar" onClick={()=>setTab("Settings")}>Y</button></div></header><div className="content-wrap">{pages[tab]()}<footer className="footer"><span>available.AI <i>·</i> Your business, moving forward.</span><span>AI actions stay under your control.</span></footer></div></div>
  {notice&&<div className="toast"><CheckCircle2 size={16}/>{notice}</div>}
 </main>;
}
