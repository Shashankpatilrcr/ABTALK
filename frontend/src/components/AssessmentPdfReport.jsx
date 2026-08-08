import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const safeName = (name) => `${(String(name || 'Candidate').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim().replace(/\s+/g, '_') || 'Candidate')}_Technical_Interview_Report.pdf`;
const list = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
const section = { marginBottom: 24, breakInside: 'avoid' };
const text = { margin: '0 0 9px', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' };

const AssessmentPdfReport = forwardRef(function AssessmentPdfReport({ feedback, candidate, generatedAt }, ref) {
  const node = useRef(null);
  const member = candidate?.member || {};
  const results = list(feedback?.results);
  const score = typeof feedback?.average_score === 'number' ? `${feedback.average_score.toFixed(1)} / 10` : 'Not available';
  const topics = list(feedback?.covered_curriculum_topics);
  const days = list(feedback?.covered_curriculum_days);
  const candidateRows = [['Candidate Name', member.name], ['Role', member.jobRole], ['Experience', member.yearsExperience != null ? `${member.yearsExperience} years` : null], ['Education', member.education]].filter(([, value]) => value != null && value !== '');

  useImperativeHandle(ref, () => ({ async download() {
    if (!node.current) throw new Error('Report is unavailable');
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
    const canvas = await html2canvas(node.current, { scale: 1.5, backgroundColor: '#ffffff', logging: false });
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const margin = 10, width = 190, height = canvas.height * width / canvas.width, usable = 277;
    for (let offset = 0, page = 1; offset < height; offset += usable, page += 1) {
      if (page > 1) pdf.addPage();
      pdf.addImage(canvas, 'PNG', margin, margin - offset, width, height, undefined, 'FAST');
      pdf.setFontSize(8); pdf.setTextColor(100); pdf.text(`AI Technical Interview Assessment Report | Page ${page}`, 105, 291, { align: 'center' });
    }
    pdf.save(safeName(member.name));
  }}), [member.name]);

  return <div style={{ position: 'fixed', left: '-100000px', top: 0 }} aria-hidden="true"><article ref={node} style={{ width: 794, boxSizing: 'border-box', padding: 42, background: '#fff', color: '#172033', fontFamily: 'Arial, sans-serif', fontSize: 12, lineHeight: 1.5 }}>
    <header style={{ borderBottom: '3px solid #2563eb', paddingBottom: 18, marginBottom: 24 }}><div style={{ color: '#2563eb', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>AI INTERVIEW AGENT</div><h1 style={{ fontSize: 25, margin: '7px 0 4px' }}>AI Technical Interview Assessment Report</h1><div style={{ color: '#475569' }}>Formal technical interview assessment</div></header>
    <Section title="Report Overview"><Table rows={[["Candidate", member.name || 'Not available'], ['Interview date/time', generatedAt || 'Not available'], ['Interview/session ID', feedback?.session_id || 'Not available'], ['Overall score', score], ['Overall assessment', feedback?.status === 'completed' ? 'Interview completed' : 'Not available']]} /></Section>
    {candidateRows.length > 0 && <Section title="Candidate Information"><Table rows={candidateRows} /></Section>}
    <Section title="Interview Summary"><Table rows={[["Questions asked", String(results.length)], ['Questions evaluated', String(feedback?.evaluated_count ?? 0)], ['Curriculum days assessed', days.length ? days.map(d => `Day ${d}`).join(', ') : 'Not available'], ['Curriculum topics assessed', topics.length ? topics.join(', ') : 'Not available'], ['Overall performance summary', results.length ? `Average evaluated score: ${score}.` : 'No completed answer evaluations are available.']]} /></Section>
    {results.length > 0 && <Section title="Question-by-Question Assessment">{results.map((r, i) => <Question key={i} result={r} index={i} />)}</Section>}
    <Section title="Performance Analysis"><h3 style={{ fontSize: 13, margin: '0 0 6px' }}>Technical Knowledge &amp; Conceptual Understanding</h3><p style={text}>This summary is based only on recorded answer evaluations. The interview system did not generate separate communication, reasoning, or engineering dimension scores.</p><Feedback feedback={feedback} /></Section>
    {topics.length > 0 && <Section title="Curriculum Coverage"><p style={text}>{topics.map((topic, i) => `${days[i] != null ? `Day ${days[i]}: ` : ''}${topic}`).join(' • ')}</p></Section>}
    <Section title="Final Recommendation"><p style={text}>{feedback?.status === 'completed' ? 'The interview system recorded this assessment as completed. No additional hiring recommendation was generated.' : 'No final recommendation was generated.'}</p></Section>
    <Section title="Final Feedback"><Feedback feedback={feedback} /></Section>
  </article></div>;
});
function Section({ title, children }) { return <section style={section}><h2 style={{ fontSize: 16, color: '#1d4ed8', borderBottom: '1px solid #bfdbfe', paddingBottom: 6, marginBottom: 10 }}>{title}</h2>{children}</section>; }
function Table({ rows }) { return <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>{rows.map(([a, b]) => <tr key={a}><th style={{ textAlign: 'left', width: '34%', padding: '7px 9px', background: '#f1f5f9', border: '1px solid #dbeafe', verticalAlign: 'top' }}>{a}</th><td style={{ padding: '7px 9px', border: '1px solid #dbeafe', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{b}</td></tr>)}</tbody></table>; }
function Feedback({ feedback }) { return <div>{[['Strengths', feedback?.overall_strengths, 'No strengths were generated.'], ['Areas for Improvement', feedback?.overall_weaknesses, 'No areas for improvement were generated.'], ['Actionable Recommendations', feedback?.overall_suggestions, 'No recommendations were generated.']].map(([title, values, empty]) => <div key={title}><h3 style={{ fontSize: 13, margin: '10px 0 4px' }}>{title}</h3>{list(values).length ? <ul style={{ margin: '4px 0 9px', paddingLeft: 20 }}>{list(values).map((v, i) => <li key={i} style={{ marginBottom: 4, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{v}</li>)}</ul> : <p style={text}>{empty}</p>}</div>)}</div>; }
function Question({ result, index }) { return <div style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: 13, marginBottom: 13, breakInside: 'avoid' }}><h3 style={{ margin: '0 0 9px', fontSize: 14 }}>Question {index + 1}{result.curriculum_day != null ? ` — Day ${result.curriculum_day}` : ''}{result.curriculum_topic ? `: ${result.curriculum_topic}` : ''}</h3><p style={text}><strong>Question:</strong> {result.question}</p><p style={text}><strong>Candidate answer:</strong> {result.answer}</p><Table rows={[["Score", typeof result.score === 'number' ? `${result.score} / 10` : 'Not available'], ['Strengths', result.strength || 'Not generated'], ['Areas for improvement', result.weakness || 'Not generated'], ['Evaluation / recommendation', result.suggestion || 'Not generated']]} /></div>; }
export default AssessmentPdfReport;
