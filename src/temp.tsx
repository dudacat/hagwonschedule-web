import { useState } from "react";

const DAYS = ["월","화","수","목","금"];
const COLORS = {
  "피아노": { bg: "#fce4ec", border: "#e91e63", text: "#880e4f" },
  "주짓수": { bg: "#e8f5e9", border: "#4caf50", text: "#1b5e20" },
  "수학": { bg: "#e3f2fd", border: "#2196f3", text: "#0d47a1" },
  "국어": { bg: "#fff3e0", border: "#ff9800", text: "#e65100" },
  "수학+국어": { bg: "#f3e5f5", border: "#9c27b0", text: "#4a148c" },
  "눈높이": { bg: "#e0f7fa", border: "#00838f", text: "#006064" },
  "수학+역사": { bg: "#fff8e1", border: "#f9a825", text: "#e65100" },
  "미술": { bg: "#fff9c4", border: "#f57f17", text: "#e65100" },
  "바둑": { bg: "#e8eaf6", border: "#3949ab", text: "#1a237e" },
  "픽업": { bg: "#fff3e0", border: "#e65100", text: "#bf360c" },
  "하교": { bg: "#fffde7", border: "#ffc107", text: "#ff6f00" },
  "기타": { bg: "#f5f5f5", border: "#bdbdbd", text: "#424242" },
};

const SUBJECT_LIST = ["피아노","주짓수","눈높이","바둑","미술","픽업","기타"];

const initData = {
  월: [
    { id:1, subject:"하교", time:"1시 40분", endTime:"", memo:"" },
    { id:2, subject:"피아노", time:"2시", endTime:"3시", memo:"" },
    { id:3, subject:"주짓수", time:"3시 20분", endTime:"4시 20분", memo:"" },
    { id:4, subject:"픽업", time:"4시 20분", endTime:"", memo:"" },
  ],
  화: [
    { id:5, subject:"하교", time:"1시 40분", endTime:"", memo:"" },
    { id:6, subject:"눈높이", time:"1시 50분", endTime:"3시 15분", memo:"수학, 역사" },
    { id:21, subject:"주짓수", time:"3시 20분", endTime:"4시 20분", memo:"" },
    { id:8, subject:"픽업", time:"4시 20분", endTime:"", memo:"" },
  ],
  수: [
    { id:9, subject:"하교", time:"12시 50분", endTime:"", memo:"집으로 귀가" },
    { id:10, subject:"피아노", time:"2시 20분", endTime:"3시 20분", memo:"" },
    { id:11, subject:"주짓수", time:"3시 20분", endTime:"", memo:"" },
    { id:12, subject:"픽업", time:"4시 20분", endTime:"", memo:"" },
    { id:24, subject:"바둑", time:"6시 20분", endTime:"7시 20분", memo:"" },
  ],
  목: [
    { id:13, subject:"하교", time:"3시 5분", endTime:"", memo:"" },
    { id:14, subject:"미술", time:"3시 15분", endTime:"4시 25분", memo:"" },

    { id:22, subject:"눈높이", time:"4시 30분", endTime:"6시 10분", memo:"수학, 국어" },
    { id:16, subject:"픽업", time:"6시 10분", endTime:"", memo:"" },
  ],
  금: [
    { id:17, subject:"하교", time:"2시 20분", endTime:"", memo:"하교" },
    { id:18, subject:"피아노", time:"2시 25분", endTime:"3시 20분", memo:"" },
    { id:19, subject:"주짓수", time:"3시 20분", endTime:"4시 20분", memo:"" },
    { id:20, subject:"눈높이", time:"4시 20분", endTime:"6시 10분", memo:"수학, 국어" },
    { id:23, subject:"픽업", time:"6시 10분", endTime:"", memo:"" },
  ],
};

let nextId = 100;

export default function App() {
  const [schedules, setSchedules] = useState(initData);
  const [activeDay, setActiveDay] = useState("월");
  const [modal, setModal] = useState(null); // {mode:'add'|'edit', day, item?}
  const [form, setForm] = useState({ subject:"피아노", time:"", endTime:"", memo:"" });
  const [view, setView] = useState("week"); // 'week' | 'day'

  const openAdd = (day) => {
    setForm({ subject:"피아노", time:"", endTime:"", memo:"" });
    setModal({ mode:"add", day });
  };
  const openEdit = (day, item) => {
    setForm({ subject:item.subject, time:item.time, endTime:item.endTime, memo:item.memo });
    setModal({ mode:"edit", day, item });
  };
  const closeModal = () => setModal(null);

  const saveItem = () => {
    if(!form.time.trim()) return alert("시간을 입력해주세요");
    if(modal.mode === "add") {
      setSchedules(prev => ({
        ...prev,
        [modal.day]: [...prev[modal.day], { id: nextId++, ...form }]
      }));
    } else {
      setSchedules(prev => ({
        ...prev,
        [modal.day]: prev[modal.day].map(i => i.id===modal.item.id ? { ...i, ...form } : i)
      }));
    }
    closeModal();
  };

  const deleteItem = (day, id) => {
    if(!confirm("삭제할까요?")) return;
    setSchedules(prev => ({ ...prev, [day]: prev[day].filter(i=>i.id!==id) }));
  };

  const getColor = (subject) => COLORS[subject] || COLORS["기타"];

  // Week view
  const WeekView = () => (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
        <thead>
          <tr>
            {DAYS.map(d => (
              <th key={d} style={{
                padding:"10px 6px", textAlign:"center", fontSize:15, fontWeight:700,
                background: d===activeDay ? "#6c63ff" : "#f0f0f0",
                color: d===activeDay ? "#fff" : "#333",
                borderRadius:8, cursor:"pointer", border:"2px solid #fff"
              }} onClick={()=>{ setActiveDay(d); setView("day"); }}>
                {d}요일
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(...DAYS.map(d=>schedules[d].length)) }).map((_,ri) => (
            <tr key={ri}>
              {DAYS.map(d => {
                const item = schedules[d][ri];
                if(!item) return <td key={d} style={{padding:4}}></td>;
                const c = getColor(item.subject);
                return (
                  <td key={d} style={{ padding:4, verticalAlign:"top" }}>
                    <div style={{
                      background:c.bg, border:`1.5px solid ${c.border}`,
                      borderRadius:8, padding:"6px 8px", cursor:"pointer",
                      fontSize:12
                    }} onClick={()=>openEdit(d,item)}>
                      <div style={{ fontWeight:700, color:c.text }}>{item.subject}</div>
                      <div style={{ color:"#555", marginTop:2 }}>{item.time}</div>
                      {item.endTime && <div style={{ color:"#888" }}>~{item.endTime}</div>}
                      {item.memo && <div style={{ color:"#999", fontSize:11, marginTop:2 }}>{item.memo}</div>}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            {DAYS.map(d => (
              <td key={d} style={{ padding:4 }}>
                <button onClick={()=>openAdd(d)} style={{
                  width:"100%", padding:"6px 0", border:"1.5px dashed #bbb",
                  borderRadius:8, background:"transparent", cursor:"pointer",
                  color:"#999", fontSize:18
                }}>+</button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  // Day view
  const DayView = () => (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {DAYS.map(d => (
          <button key={d} onClick={()=>setActiveDay(d)} style={{
            padding:"8px 18px", borderRadius:20, border:"none", cursor:"pointer",
            background: d===activeDay ? "#6c63ff" : "#eee",
            color: d===activeDay ? "#fff" : "#333",
            fontWeight: d===activeDay ? 700 : 400, fontSize:14
          }}>{d}요일</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {schedules[activeDay].map((item,i) => {
          const c = getColor(item.subject);
          return (
            <div key={item.id} style={{
              background:c.bg, border:`2px solid ${c.border}`,
              borderRadius:12, padding:"14px 16px",
              display:"flex", alignItems:"center", gap:12
            }}>
              <div style={{
                width:36, height:36, borderRadius:"50%",
                background:c.border, color:"#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:700, fontSize:14, flexShrink:0
              }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:c.text, fontSize:16 }}>{item.subject}</div>
                <div style={{ color:"#555", fontSize:14, marginTop:2 }}>
                  🕐 {item.time}{item.endTime ? ` ~ ${item.endTime}` : ""}
                </div>
                {item.memo && <div style={{ color:"#888", fontSize:13, marginTop:3 }}>📝 {item.memo}</div>}
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={()=>openEdit(activeDay,item)} style={{
                  padding:"6px 12px", borderRadius:8, border:"none",
                  background:"#fff", cursor:"pointer", fontSize:13, color:"#555"
                }}>✏️</button>
                <button onClick={()=>deleteItem(activeDay,item.id)} style={{
                  padding:"6px 12px", borderRadius:8, border:"none",
                  background:"#ffebee", cursor:"pointer", fontSize:13, color:"#e53935"
                }}>🗑️</button>
              </div>
            </div>
          );
        })}
        <button onClick={()=>openAdd(activeDay)} style={{
          padding:"14px", borderRadius:12, border:"2px dashed #bbb",
          background:"transparent", cursor:"pointer", color:"#aaa",
          fontSize:16, fontWeight:700
        }}>+ 일정 추가</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f8f7ff", padding:"20px 16px", fontFamily:"'Noto Sans KR',sans-serif" }}>
      {/* Header */}
      <div style={{
        background:"linear-gradient(135deg,#6c63ff,#a78bfa)",
        borderRadius:20, padding:"20px 24px", marginBottom:20,
        color:"#fff", boxShadow:"0 4px 20px rgba(108,99,255,0.3)"
      }}>
        <div style={{ fontSize:22, fontWeight:800 }}>📚 학원 스케줄</div>
        <div style={{ fontSize:14, opacity:0.85, marginTop:4 }}>
          {new Date().toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric",weekday:"long"})}
        </div>
      </div>

      {/* 과목 범례 */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
        {SUBJECT_LIST.map(s => {
          const c = getColor(s);
          return (
            <span key={s} style={{
              padding:"4px 10px", borderRadius:20,
              background:c.bg, border:`1.5px solid ${c.border}`,
              color:c.text, fontSize:12, fontWeight:600
            }}>{s}</span>
          );
        })}
      </div>

      {/* View Toggle */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[["week","📅 주간"],["day","📋 일별"]].map(([v,label]) => (
          <button key={v} onClick={()=>setView(v)} style={{
            padding:"8px 20px", borderRadius:20, border:"none", cursor:"pointer",
            background: view===v ? "#6c63ff" : "#eee",
            color: view===v ? "#fff" : "#555",
            fontWeight: view===v ? 700 : 400, fontSize:14
          }}>{label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background:"#fff", borderRadius:16, padding:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
        {view==="week" ? <WeekView/> : <DayView/>}
      </div>

      {/* Modal */}
      {modal && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16
        }} onClick={e=>{ if(e.target===e.currentTarget) closeModal(); }}>
          <div style={{ background:"#fff", borderRadius:20, padding:28, width:"100%", maxWidth:380, boxShadow:"0 8px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize:18, fontWeight:800, marginBottom:20 }}>
              {modal.mode==="add" ? `➕ ${modal.day}요일 추가` : `✏️ ${modal.day}요일 수정`}
            </div>

            {[["과목","subject"],["시작 시간","time"],["종료 시간 (선택)","endTime"],["메모 (선택)","memo"]].map(([label,key]) => (
              <div key={key} style={{ marginBottom:14 }}>
                <div style={{ fontSize:13, color:"#666", marginBottom:5, fontWeight:600 }}>{label}</div>
                {key==="subject" ? (
                  <select value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                    style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #ddd", fontSize:14 }}>
                    {SUBJECT_LIST.map(s=><option key={s}>{s}</option>)}
                  </select>
                ) : (
                  <input value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                    placeholder={key==="time"?"예: 2시 30분":""}
                    style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #ddd", fontSize:14, boxSizing:"border-box" }}/>
                )}
              </div>
            ))}

            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button onClick={closeModal} style={{
                flex:1, padding:"12px", borderRadius:12, border:"1.5px solid #ddd",
                background:"#fff", cursor:"pointer", fontSize:15, color:"#555"
              }}>취소</button>
              <button onClick={saveItem} style={{
                flex:2, padding:"12px", borderRadius:12, border:"none",
                background:"linear-gradient(135deg,#6c63ff,#a78bfa)",
                color:"#fff", cursor:"pointer", fontSize:15, fontWeight:700
              }}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
