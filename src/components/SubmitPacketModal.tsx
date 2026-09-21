import { useEffect, useState } from "react";
import type { PacketDoc, PacketField } from "../content/types";
import { APPLICANT, GUARD_COMPANY, buildPacketDocs, packetLead } from "../lib/submitPackets";
import { useDemo } from "../state/DemoStore";
import { RegulationPlan } from "./RegulationPlan";
import { Stamp } from "./Stamp";

function FieldInput({
  field,
  onChange,
  locked,
}: {
  field: PacketField;
  onChange: (value: string) => void;
  locked: boolean;
}) {
  if (!field.editable) {
    return <span>{field.value}</span>;
  }
  return (
    <input
      type="text"
      className="sheet-input"
      value={field.value}
      disabled={locked}
      onChange={(e) => onChange(e.target.value)}
      aria-label={field.label}
    />
  );
}

function val(fields: PacketField[], key: string) {
  return fields.find((f) => f.key === key)?.value ?? "";
}

function RoadUseForm({
  fields,
  onChange,
  locked,
}: {
  fields: PacketField[];
  onChange: (key: string, value: string) => void;
  locked: boolean;
}) {
  const cell = (key: string) => {
    const field = fields.find((f) => f.key === key);
    if (!field) return null;
    return <FieldInput field={field} locked={locked} onChange={(v) => onChange(key, v)} />;
  };

  return (
    <article className="official-sheet">
      <h4 className="official-title">道　路　使　用　許　可　申　請　書</h4>
      <div className="official-date">{cell("filedOn")}</div>
      <div className="official-to">{cell("police")}</div>
      <div className="official-applicant">
        <div className="official-applicant-k">申請者</div>
        <div>
          <div className="official-line">
            <span>住所</span>
            {cell("applicantAddr")}
          </div>
          <div className="official-line">
            <span>氏名</span>
            {cell("applicant")}
            <Stamp lines={["ideal", "合同会社", "之印"]} variant="square" />
          </div>
        </div>
      </div>
      <table className="official-table">
        <tbody>
          <tr>
            <th>道路使用の目的</th>
            <td colSpan={3}>{cell("purpose")}</td>
          </tr>
          <tr>
            <th>場所又は区間</th>
            <td colSpan={3}>{cell("place")}</td>
          </tr>
          <tr>
            <th>期　　間</th>
            <td colSpan={3}>{cell("period")}</td>
          </tr>
          <tr>
            <th>方法又は形態</th>
            <td colSpan={3}>{cell("method")}</td>
          </tr>
          <tr>
            <th>添　付　書　類</th>
            <td colSpan={3}>{cell("attach")}</td>
          </tr>
          <tr>
            <th>現 場 住 所</th>
            <td colSpan={3}>{cell("siteAddr")}</td>
          </tr>
          <tr>
            <th>責任者氏名</th>
            <td>{cell("supervisor")}</td>
            <th>電話</th>
            <td>{cell("phone")}</td>
          </tr>
        </tbody>
      </table>
      <div className="official-permit">
        <div className="official-permit-no">第　　　　号</div>
        <h5>道　路　使　用　許　可　証</h5>
        <p>上記のとおり許可する。ただし、次の条件に従うこと。</p>
        <table className="official-table">
          <tbody>
            <tr>
              <th>条　件</th>
              <td className="is-blank">（提出後、所轄が記入します）</td>
            </tr>
          </tbody>
        </table>
        <div className="official-sign">
          <span>年　　月　　日</span>
          <span>警察署長　　印</span>
        </div>
      </div>
    </article>
  );
}

function OccupyForm({
  fields,
  onChange,
  locked,
}: {
  fields: PacketField[];
  onChange: (key: string, value: string) => void;
  locked: boolean;
}) {
  const cell = (key: string) => {
    const field = fields.find((f) => f.key === key);
    if (!field) return null;
    return <FieldInput field={field} locked={locked} onChange={(v) => onChange(key, v)} />;
  };

  return (
    <article className="official-sheet">
      <h4 className="official-title">道　路　占　用　許　可　申　請　書</h4>
      <div className="official-date">{cell("filedOn")}</div>
      <div className="official-to">{cell("admin")}　御中</div>
      <div className="official-applicant">
        <div className="official-applicant-k">占用者</div>
        <div>
          <div className="official-line">
            <span>住所</span>
            {cell("applicantAddr")}
          </div>
          <div className="official-line">
            <span>氏名</span>
            {cell("applicant")}
            <Stamp lines={["ideal", "合同会社", "之印"]} variant="square" />
          </div>
        </div>
      </div>
      <table className="official-table">
        <tbody>
          <tr>
            <th>占用の場所</th>
            <td>{cell("place")}</td>
          </tr>
          <tr>
            <th>占用物件</th>
            <td>{cell("object")}</td>
          </tr>
          <tr>
            <th>占用の期間</th>
            <td>{cell("period")}</td>
          </tr>
          <tr>
            <th>占用の目的</th>
            <td>{cell("purpose")}</td>
          </tr>
          <tr>
            <th>現場代理人</th>
            <td>{cell("supervisor")}</td>
          </tr>
          <tr>
            <th>連絡先</th>
            <td>{cell("phone")}</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}

function BuriedForm({
  fields,
  onChange,
  locked,
}: {
  fields: PacketField[];
  onChange: (key: string, value: string) => void;
  locked: boolean;
}) {
  const cell = (key: string) => {
    const field = fields.find((f) => f.key === key);
    if (!field) return null;
    return <FieldInput field={field} locked={locked} onChange={(v) => onChange(key, v)} />;
  };

  return (
    <article className="official-sheet">
      <h4 className="official-title">埋　設　物　照　会　依　頼　書</h4>
      <div className="official-date">{cell("filedOn")}</div>
      <div className="official-to">{cell("to")}　御中</div>
      <p className="official-lead">下記の工事に伴い、埋設物の位置照会をお願いします。</p>
      <table className="official-table">
        <tbody>
          <tr>
            <th>依頼者</th>
            <td>{cell("from")}</td>
          </tr>
          <tr>
            <th>工事場所</th>
            <td>{cell("place")}</td>
          </tr>
          <tr>
            <th>工事内容</th>
            <td>{cell("work")}</td>
          </tr>
          <tr>
            <th>掘削範囲</th>
            <td>{cell("dig")}</td>
          </tr>
          <tr>
            <th>着工予定</th>
            <td>{cell("start")}</td>
          </tr>
          <tr>
            <th>回答希望日</th>
            <td>{cell("due")}</td>
          </tr>
          <tr>
            <th>担当／連絡先</th>
            <td>
              {cell("supervisor")}　／　{cell("phone")}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="official-sign">
        <Stamp lines={["ideal", "合同会社", "之印"]} variant="square" />
      </div>
    </article>
  );
}

function GuardOrder({
  fields,
  onChange,
  locked,
}: {
  fields: PacketField[];
  onChange: (key: string, value: string) => void;
  locked: boolean;
}) {
  const cell = (key: string) => {
    const field = fields.find((f) => f.key === key);
    if (!field) return null;
    return <FieldInput field={field} locked={locked} onChange={(v) => onChange(key, v)} />;
  };

  return (
    <article className="order-sheet">
      <header className="order-hd">
        <div>
          <p className="order-kicker">TRAFFIC CONTROL ORDER</p>
          <h4>交通誘導警備　配置依頼書</h4>
        </div>
        <div className="order-no">
          <span>依頼番号</span>
          {cell("orderNo")}
        </div>
      </header>
      <div className="order-meta">
        <div>
          <span>依頼日</span>
          {cell("orderDate")}
        </div>
        <div className="order-stamps">
          <Stamp lines={["ideal", "合同会社", "之印"]} variant="square" />
          <Stamp lines={["城西", "警備保障", "之印"]} variant="square" tone="navy" />
        </div>
      </div>
      <table className="order-table">
        <tbody>
          <tr>
            <th>発注者（甲）</th>
            <td>{cell("client")}</td>
          </tr>
          <tr>
            <th>受注者（乙）</th>
            <td>{cell("vendor")}</td>
          </tr>
          <tr>
            <th>配置場所</th>
            <td>{cell("site")}</td>
          </tr>
          <tr>
            <th>配置日時</th>
            <td>{cell("when")}</td>
          </tr>
          <tr>
            <th>配置人数</th>
            <td>{cell("heads")}</td>
          </tr>
          <tr>
            <th>業務内容</th>
            <td>{cell("work")}</td>
          </tr>
          <tr>
            <th>現場連絡先</th>
            <td>{cell("contact")}</td>
          </tr>
        </tbody>
      </table>
      <p className="order-foot">上記のとおり、交通誘導警備員の配置を依頼します。</p>
    </article>
  );
}

function GuardContract({ fields }: { fields: PacketField[] }) {
  return (
    <article className="contract-sheet">
      <div className="contract-band">城西警備保障株式会社　業務委託</div>
      <h4>交通誘導警備業務委託契約書</h4>
      <p className="contract-lead">
        委託者（以下「甲」という。）{val(fields, "client")}と受託者（以下「乙」という。）{val(fields, "vendor")}
        は、交通誘導警備業務の委託について、次のとおり契約する。
      </p>
      <section>
        <h5>第1条（目的）</h5>
        <p>
          甲が実施する電気工事に伴い必要な交通誘導警備業務について、乙がこれを受託し実施する。
        </p>
      </section>
      <section>
        <h5>第2条（業務内容）</h5>
        <ol>
          <li>工事現場周辺における車両誘導業務</li>
          <li>歩行者の安全確保および誘導業務</li>
          <li>工事関係車両の出入り管理業務</li>
          <li>交通規制区域内における安全監視業務</li>
        </ol>
      </section>
      <section>
        <h5>第3条（業務実施場所）</h5>
        <p>{val(fields, "site")}</p>
      </section>
      <section>
        <h5>第4条（業務実施日時）</h5>
        <p>{val(fields, "when")}</p>
      </section>
      <section>
        <h5>第5条（警備員の配置）</h5>
        <ol>
          <li>乙は、警備業法その他関係法令に基づき適切な教育を受けた警備員を配置する。</li>
          <li>配置人数は {val(fields, "heads")} とする。</li>
          <li>乙は業務遂行上必要と判断した場合、甲と協議のうえ配置人数を変更することができる。</li>
        </ol>
      </section>
      <div className="contract-sign">
        <p>本契約の成立を証するため、本書2通を作成し、甲乙記名捺印のうえ各1通を保有する。</p>
        <p className="contract-date">{val(fields, "signedOn")}</p>
        <div className="contract-parties">
          <div>
            <div className="contract-role">甲（委託者）</div>
            <div className="contract-name">
              {APPLICANT}
              <Stamp lines={["ideal", "合同会社", "之印"]} variant="square" />
            </div>
            <div className="contract-addr">東京都港区南青山二丁目2番3号</div>
          </div>
          <div>
            <div className="contract-role">乙（受託者）</div>
            <div className="contract-name">
              {GUARD_COMPANY}
              <Stamp lines={["城西", "警備保障", "之印"]} variant="square" tone="navy" />
            </div>
            <div className="contract-addr">東京都新宿区西新宿六丁目12番8号</div>
          </div>
        </div>
      </div>
    </article>
  );
}

function DocBody({
  doc,
  onChange,
  locked,
  locname,
  isNight,
}: {
  doc: PacketDoc;
  onChange: (key: string, value: string) => void;
  locked: boolean;
  locname: string;
  isNight: boolean;
}) {
  if (doc.kind === "road-use-form") {
    return <RoadUseForm fields={doc.fields} onChange={onChange} locked={locked} />;
  }
  if (doc.kind === "occupy-form") {
    return <OccupyForm fields={doc.fields} onChange={onChange} locked={locked} />;
  }
  if (doc.kind === "buried-form") {
    return <BuriedForm fields={doc.fields} onChange={onChange} locked={locked} />;
  }
  if (doc.kind === "regulation-plan") {
    const main = locname.includes("渋谷") ? "道玄坂" : "青梅街道";
    const cross = locname.includes("渋谷") ? "井の頭通り" : "西新宿通り";
    return <RegulationPlan locname={locname} isNight={isNight} mainStreet={main} crossStreet={cross} />;
  }
  if (doc.kind === "guard-order") {
    return <GuardOrder fields={doc.fields} onChange={onChange} locked={locked} />;
  }
  return <GuardContract fields={doc.fields} />;
}

export function SubmitPacketModal() {
  const {
    packetTaskId,
    closePacket,
    executeTasks,
    site,
    workDateIso,
    guardCount,
    naraMode,
    packetFieldOf,
    setPacketField,
    markPacketReady,
    taskStatusOf,
  } = useDemo();

  const task = executeTasks.find((t) => t.id === packetTaskId) ?? null;
  const [tab, setTab] = useState(0);

  useEffect(() => {
    setTab(0);
  }, [packetTaskId]);

  useEffect(() => {
    if (!packetTaskId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePacket();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [packetTaskId, closePacket]);

  if (!packetTaskId || !task || !site) return null;

  const done = taskStatusOf(task.id) === "done";
  const docs = buildPacketDocs(task.packetKind, {
    site,
    workDateIso,
    guardCount,
    naraMode,
    edits: {},
  }).map((doc) => ({
    ...doc,
    fields: doc.fields.map((field) => ({
      ...field,
      value: packetFieldOf(task.id, field.key, field.value),
    })),
  }));
  const current = docs[tab] ?? docs[0];

  return (
    <div
      className="scrim on"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePacket();
      }}
    >
      <div className="modal packet-modal" role="dialog" aria-modal="true" aria-labelledby="packet-title">
        <div className="modal-h">
          <span>
            <span className="mt" id="packet-title">
              {task.title}
            </span>
            <span className="mtag">提出用</span>
            {done ? <span className="mtag">準備済み</span> : null}
          </span>
          <button type="button" className="x" onClick={closePacket} aria-label="閉じる">
            ×
          </button>
        </div>
        <div className="modal-b packet-body">
          <p className="packet-lead">{packetLead(task.packetKind)}</p>
          {docs.length > 1 ? (
            <div className="packet-tabs" role="tablist">
              {docs.map((doc, i) => (
                <button
                  key={doc.id}
                  type="button"
                  role="tab"
                  aria-selected={i === tab}
                  className={`packet-tab${i === tab ? " is-on" : ""}`}
                  onClick={() => setTab(i)}
                >
                  {doc.tab}
                </button>
              ))}
            </div>
          ) : null}
          {current.note ? <p className="packet-note">{current.note}</p> : null}
          <DocBody
            doc={current}
            locked={false}
            locname={site.locname}
            isNight={site.time.includes("夜")}
            onChange={(key, value) => setPacketField(task.id, key, value)}
          />
          <div className="packet-actions">
            {done ? (
              <p>提出できる状態にしています。このデモでは申請提出・配置依頼の送信は行いません。</p>
            ) : (
              <p>内容を確認し、必要なら直してから提出できる状態にしてください。</p>
            )}
            <button
              type="button"
              className="go approve-btn"
              onClick={() => markPacketReady(task.id)}
              disabled={done}
            >
              {done ? "提出準備済み" : "提出できる状態にする"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
