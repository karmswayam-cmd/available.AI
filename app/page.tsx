"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, BookOpen,
  Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, ClipboardList,
  Command, Compass, Copy, ExternalLink, FileText, Globe2, LayoutDashboard,
  Lightbulb, Menu, MessageCircle, MoreHorizontal, Plus, Rocket, Send, Settings2,
  Sparkles, Target, WandSparkles, X, Zap
} from "lucide-react";

type Section = "Overview" | "Business planner" | "Website builder" | "Growth studio" | "Documents";
type Saved = { id: number; title: string; kind: string; body: string; date: string };

const nav: { label: Section; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Business planner", icon: Compass },
  { label: "Website builder", icon: Globe2 },
  { label: "Growth studio", icon: Rocket },
  { label: "Documents", icon: FileText }
];

const initialTasks = [
  { title: "Define your business idea", detail: "Write down the problem you solve and who you help.", done: false },
  { title: "Create your first business plan", detail: "Turn your idea into a practical launch roadmap.", done: false },
  { title: "Set up your online presence", detail: "Draft the first version of your website.", done: false },
  { title: "Plan your first growth campaign", detail: "Choose one channel and a measurable goal.", done: false }
];

function makePlan(idea: string) {
  const subject = idea.trim() || "your business idea";
  return `BUSINESS STARTER PLAN\n\nIdea\n${subject}\n\n1. Customer and problem\nIdentify one specific customer group. Interview 5 potential customers about the problem before investing heavily.\n\n2. Value proposition\nDescribe the outcome you deliver in one sentence. Make the benefit concrete and easy to understand.\n\n3. First offer\nCreate the smallest paid version of the product or service. Define scope, delivery time and a simple price hypothesis.\n\n4. Find your first customers\nStart with direct conversations, relevant communities and partnerships. Track every conversation and follow-up.\n\n5. 30-day launch plan\nWeek 1: customer interviews and competitor review.\nWeek 2: define the offer and create a landing page.\nWeek 3: invite a small group of early customers.\nWeek 4: review conversion, feedback and unit economics; improve the offer.\n\nAssumptions to validate\n- Customers experience this problem often enough to pay for a solution.\n- You can reach them through at least one repeatable channel.\n- Delivery costs leave room for a sustainable margin.\n\nFirst action\nSpeak to one potential customer today and write down their exact words.`;
}

function makeCampaign(idea: string) {
  const subject = idea.trim() || "your new offer";
  return `CAMPAIGN STARTER\n\nGoal\nGet 5 qualified conversations about ${subject}.\n\nAudience\nPeople who already experience the problem your offer solves. Narrow this to one role, location or community.\n\nMessage\n“I'm speaking with people who want a better way to handle ${subject}. What is the hardest part of this for you today?”\n\n3-step sequence\n1. Share a useful insight or short customer story.\n2. Ask a specific question and invite a reply.\n3. Follow up once with a helpful resource, not pressure.\n\nMeasure\nTrack relevant replies, qualified conversations and customers—not just impressions.\n\nReview after 7 days and adjust one variable at a time.`;
}

export default function Home() {
  const [section, setSection] = useState<Section>("Overview");
  const [idea, setIdea] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [websiteTone, setWebsiteTone] = useState("Clear & confident");
  const [output, setOutput] = useState("");
  const [outputTitle, setOutputTitle] = useState("");
  const [saved, setSaved] = useState<Saved[]>([]);
  const [tasks, setTasks] = useState(initialTasks);
  const [chat, setChat] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem("available-ai-documents");
      const t = localStorage.getItem("available-ai-tasks");
      if (s) setSaved(JSON.parse(s));
      if (t) setTasks(JSON.parse(t));
    } catch { /* Ignore invalid local workspace data. */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("available-ai-documents", JSON.stringify(saved));
      localStorage.setItem("available-ai-tasks", JSON.stringify(tasks));
    } catch { /* Storage may be unavailable in private browsing. */ }
  }, [saved, tasks]);

  const completed = tasks.filter(t => t.done).length;
  const progress = Math.round(completed / tasks.length * 100);

  const websiteCopy = useMemo(() => {
    const name = businessName.trim() || "Your brand";
    const line = tagline.trim() || "A better way to get the result you need.";
    return `HOME PAGE DRAFT\n\n${name}\n${line}\n\nINTRODUCTION\nWe help people move from a frustrating problem to a clear, practical result. Thoughtful service, straightforward communication and a focus on what matters.\n\nWHAT WE DO\nA focused offer designed around your customers' real needs. Tell visitors what is included, who it is for and what happens next.\n\nWHY CHOOSE US\n- Clear expectations from the first conversation\n- A practical process with no unnecessary complexity\n- Support focused on a useful outcome\n\nCALL TO ACTION\nReady to take the next step? Get in touch and tell us what you are working towards.\n\nWriting direction: ${websiteTone}.`;
  }, [businessName, tagline, websiteTone]);

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function createDocument(title: string, body: string, kind: string) {
    const doc = { id: Date.now(), title, body, kind, date: new Date().toLocaleDateString() };
    setSaved(current => [doc, ...current]);
    setOutput(body);
    setOutputTitle(title);
    notify("Saved to your documents");
  }

  async function copyOutput() {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); notify("Copied to clipboard"); }
    catch { notify("Clipboard access is unavailable in this browser"); }
  }

  function sendChat() {
    const q = chat.trim();
    if (!q) return;
    setChatReply("I can help you structure this next step. Start by identifying the customer, the problem they need solved, and the smallest useful outcome you can deliver. Add your business idea in the planner to create a working starter plan. This workspace currently uses built-in templates; connect an AI provider to enable live AI conversations.");
    setChat("");
  }

  function renderOutput() {
    if (!output) return null;
    return <div className="output-card">
      <div className="output-head"><div><span className="eyebrow">WORKSPACE DRAFT</span><h3>{outputTitle}</h3></div><button className="icon-button" onClick={() => setOutput("")} aria-label="Close draft"><X size={17}/></button></div>
      <pre>{output}</pre>
      <div className="output-actions"><button className="button secondary" onClick={copyOutput}><Copy size={15}/> Copy</button><button className="button primary" onClick={() => createDocument(outputTitle || "Untitled draft", output, "Draft")}><Check size={15}/> Save document</button></div>
    </div>;
  }

  function pageContent() {
    if (section === "Business planner") return <div className="page-grid">
      <section className="panel form-panel"><div className="panel-title"><div><span className="eyebrow">START WITH THE WHY</span><h2>Shape your business idea</h2><p>Turn a rough thought into a practical first plan.</p></div><span className="round-icon lilac"><Lightbulb size={20}/></span></div>
        <label htmlFor="idea">What are you thinking of building?</label><textarea id="idea" value={idea} onChange={e => setIdea(e.target.value)} placeholder="e.g. A local platform that helps independent tutors find students..." rows={5}/>
        <div className="helper">A sentence or two is enough to get started.</div>
        <button className="button primary full" onClick={() => createDocument("Business starter plan", makePlan(idea), "Business plan")}><Sparkles size={16}/> Create starter plan <ArrowRight size={16}/></button>
      </section>
      <aside className="panel tip-panel"><span className="eyebrow">A GOOD FIRST TEST</span><h3>Validate before you build</h3><p>The strongest early signal is a real customer describing the problem in their own words—and showing they will take a step to solve it.</p><div className="tip-list"><div><CheckCircle2 size={17}/> Talk to five potential customers</div><div><CheckCircle2 size={17}/> Identify existing alternatives</div><div><CheckCircle2 size={17}/> Test a small paid offer</div></div></aside>{renderOutput()}</div>;

    if (section === "Website builder") return <div className="page-grid">
      <section className="panel form-panel"><div className="panel-title"><div><span className="eyebrow">YOUR FIRST IMPRESSION</span><h2>Draft your website copy</h2><p>Start with a clear message customers can understand.</p></div><span className="round-icon blue"><Globe2 size={20}/></span></div>
        <label htmlFor="brand">Business or project name</label><input id="brand" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. Northstar Studio"/>
        <label htmlFor="tagline">What do you help people do?</label><input id="tagline" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="e.g. Make better spaces, without the stress"/>
        <label htmlFor="tone">Writing style</label><select id="tone" value={websiteTone} onChange={e => setWebsiteTone(e.target.value)}><option>Clear & confident</option><option>Warm & approachable</option><option>Premium & minimal</option><option>Bold & energetic</option></select>
        <button className="button primary full" onClick={() => createDocument("Website copy draft", websiteCopy, "Website")}><WandSparkles size={16}/> Generate website draft <ArrowRight size={16}/></button>
      </section>
      <aside className="panel preview-panel"><div className="preview-top"><span className="dot"/><span className="dot"/><span className="dot"/><span className="preview-url">yourbusiness.com</span></div><div className="mini-site"><span className="mini-brand">{businessName || "Your brand"}</span><div className="mini-hero"><span className="eyebrow">MADE FOR WHAT'S NEXT</span><h2>{tagline || "A better way to get the result you need."}</h2><p>Thoughtful service. Clear next steps. A focus on what matters.</p><span className="mini-cta">Let's talk <ArrowRight size={13}/></span></div><div className="mini-foot"><div/><div/><div/></div></div></aside>{renderOutput()}</div>;

    if (section === "Growth studio") return <div className="page-grid">
      <section className="panel form-panel"><div className="panel-title"><div><span className="eyebrow">FIND YOUR FIRST CUSTOMERS</span><h2>Plan a simple growth campaign</h2><p>Focus on useful conversations, not vanity metrics.</p></div><span className="round-icon peach"><Rocket size={20}/></span></div>
        <label htmlFor="growth-idea">What are you offering?</label><textarea id="growth-idea" value={idea} onChange={e => setIdea(e.target.value)} placeholder="Describe your product or service..." rows={4}/>
        <div className="campaign-stat"><div><Target size={18}/><span><b>5</b><small>qualified conversations</small></span></div><div><Activity size={18}/><span><b>7 days</b><small>first review window</small></span></div></div>
        <button className="button primary full" onClick={() => createDocument("Growth campaign starter", makeCampaign(idea), "Campaign")}><Sparkles size={16}/> Create campaign draft <ArrowRight size={16}/></button>
      </section>
      <aside className="panel tip-panel"><span className="eyebrow">KEEP IT HUMAN</span><h3>Earn attention with relevance</h3><p>Choose one audience and one channel. Share something genuinely useful, ask a thoughtful question, and follow up respectfully.</p><div className="tip-list"><div><CheckCircle2 size={17}/> One audience</div><div><CheckCircle2 size={17}/> One clear message</div><div><CheckCircle2 size={17}/> One measurable goal</div></div></aside>{renderOutput()}</div>;

    if (section === "Documents") return <div className="panel docs-panel"><div className="panel-title"><div><span className="eyebrow">YOUR WORKSPACE</span><h2>Documents</h2><p>Your saved plans and drafts stay in this browser.</p></div><span className="round-icon blue"><BookOpen size={20}/></span></div>
      {saved.length ? <div className="doc-list">{saved.map(doc => <button className="doc-row" key={doc.id} onClick={() => {setOutput(doc.body);setOutputTitle(doc.title);}}><span className="doc-icon"><FileText size={18}/></span><span className="doc-meta"><b>{doc.title}</b><small>{doc.kind} · {doc.date}</small></span><ChevronRight size={17}/></button>)}</div> : <div className="empty-state"><div className="empty-icon"><FileText size={24}/></div><h3>No documents yet</h3><p>Create a business plan, website draft or growth campaign to see it here.</p><button className="button secondary" onClick={() => setSection("Business planner")}>Start with a business plan <ArrowRight size={15}/></button></div>}{renderOutput()}</div>;

    return <div className="overview">
      <section className="welcome-card"><div className="welcome-copy"><span className="welcome-label"><Sparkles size={14}/> YOUR BUSINESS WORKSPACE</span><h2>Big idea? Let's make<br/> <em>something real.</em></h2><p>One clear next step can turn an idea into momentum. Start with what you're building.</p><button className="button light" onClick={() => setSection("Business planner")}>Build your business plan <ArrowRight size={16}/></button></div><div className="welcome-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-core"><Zap size={32}/></div><div className="float-card float-a"><CheckCircle2 size={15}/> One step at a time</div><div className="float-card float-b"><Sparkles size={15}/> Made to move</div></div></section>
      <div className="metric-grid"><div className="metric-card"><div className="metric-top"><span>Launch checklist</span><ClipboardList size={17}/></div><strong>{completed}<small>/{tasks.length}</small></strong><div className="metric-foot"><span>{progress}% complete</span><div className="progress"><i style={{width:progress+"%"}}/></div></div></div><div className="metric-card"><div className="metric-top"><span>Saved documents</span><FileText size={17}/></div><strong>{saved.length}</strong><div className="metric-foot"><span>Plans and drafts</span><span className="metric-icon"><ArrowUpRight size={15}/></span></div></div><div className="metric-card"><div className="metric-top"><span>Focus</span><Target size={17}/></div><strong>One</strong><div className="metric-foot"><span>Priority at a time</span><span className="metric-icon"><ArrowUpRight size={15}/></span></div></div></div>
      <div className="lower-grid"><section className="panel checklist-panel"><div className="panel-title"><div><span className="eyebrow">YOUR NEXT MOVES</span><h3>Launch checklist</h3></div><span className="task-count">{completed} of {tasks.length}</span></div><div className="task-list">{tasks.map((task,i) => <label className={"task-row "+(task.done?"task-done":"")} key={task.title}><input type="checkbox" checked={task.done} onChange={() => setTasks(current => current.map((t,j) => j===i?{...t,done:!t.done}:t))}/><span className="fake-check">{task.done&&<Check size={13}/>}</span><span className="task-copy"><b>{task.title}</b><small>{task.detail}</small></span><ChevronRight size={16}/></label>)}</div></section>
      <section className="panel assistant-panel"><div className="assistant-head"><div className="assistant-avatar"><Sparkles size={18}/></div><div><b>Your thinking partner</b><small>Available workspace guide</small></div><span className="online-dot"/></div><div className="assistant-message"><span className="eyebrow">A SMALL PROMPT</span><p>What's the one thing you want your business to achieve this week?</p></div>{chatReply&&<div className="assistant-reply">{chatReply}</div>}<form className="chat-form" onSubmit={e=>{e.preventDefault();sendChat();}}><input value={chat} onChange={e=>setChat(e.target.value)} placeholder="Ask for help with your next step..."/><button type="submit" aria-label="Send message"><Send size={16}/></button></form><div className="assistant-note"><span className="status-dot"/> Template mode · Live AI not connected</div></section></div>
    </div>;
  }

  return <main className="app-shell">
    <aside className={"sidebar "+(mobileOpen?"sidebar-open":"")}><div className="brand"><div className="brand-mark"><span/></div><span>available<span className="brand-ai">.AI</span></span><button className="mobile-close" onClick={()=>setMobileOpen(false)}><X size={18}/></button></div>
      <div className="workspace-switch"><div className="workspace-avatar">A</div><div><b>My workspace</b><small>Personal workspace</small></div><ChevronDown size={15}/></div>
      <span className="nav-caption">WORKSPACE</span><nav>{nav.map(item=>{const Icon=item.icon;return <button key={item.label} className={"nav-item "+(section===item.label?"active":"")} onClick={()=>{setSection(item.label);setMobileOpen(false);}}><Icon size={18}/><span>{item.label}</span>{item.label==="Documents"&&saved.length>0&&<small>{saved.length}</small>}</button>;})}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><b>Need a little direction?</b><p>Start small. Build something useful. Learn as you go.</p><button onClick={()=>setSection("Business planner")}>Explore the planner <ArrowRight size={13}/></button></div><div className="profile-row"><div className="profile-avatar">Y</div><div><b>Your account</b><small>Workspace owner</small></div><MoreHorizontal size={18}/></div></div>
    </aside>
    {mobileOpen&&<button className="mobile-scrim" onClick={()=>setMobileOpen(false)} aria-label="Close navigation"/>}
    <div className="main-area"><header className="topbar"><div className="top-left"><button className="mobile-menu icon-button" onClick={()=>setMobileOpen(true)}><Menu size={19}/></button><span className="crumb">Workspace</span><ChevronRight size={14}/><b>{section}</b></div><div className="top-right"><span className="date-label">Your space to make progress</span><button className="icon-button" aria-label="Notifications"><Bell size={18}/></button><div className="top-avatar">Y</div></div></header>
      <div className="content-wrap"><div className="page-heading"><div><span className="eyebrow">{section==="Overview"?"MONDAY ENERGY, EVERY DAY":"AVAILABLE.AI WORKSPACE"}</span><h1>{section==="Overview"?"Good things start with a first step.":section}</h1><p>{section==="Overview"?"A calm place to plan, create and grow your next thing.":"Make progress with focused tools and practical starting points."}</p></div>{section!=="Overview"&&<button className="button secondary" onClick={()=>setSection("Overview")}><LayoutDashboard size={15}/> Overview</button>}</div>
        {pageContent()}
        <footer className="footer"><span>available.AI <span>·</span> Make room for what's next.</span><span>Built for independent thinkers.</span></footer>
      </div>
    </div>
    {notice&&<div className="toast"><CheckCircle2 size={16}/>{notice}</div>}
  </main>;
}