import { inputCls } from './styles'

function resolve(root, value) {
  if (!value?.$ref?.startsWith('#/')) return value
  return value.$ref.slice(2).split('/').reduce((node, key) => node?.[key.replace(/~1/g, '/').replace(/~0/g, '~')], root) || value
}

export default function SchemaFields({ schema, scene, update, disabled }) {
  const root = resolve(schema, schema)
  const item = resolve(schema, root?.properties?.scenes?.items || root?.$defs?.scene || root?.definitions?.scene)
  const variants = item?.oneOf || item?.anyOf || []
  const selected = variants.map(value => resolve(schema, value)).find(value => value?.properties?.type?.const === scene.type || value?.properties?.type?.enum?.includes(scene.type)) || item
  const fields = Object.entries(selected?.properties || {}).filter(([key, definition]) => !['id', 'title', 'speaker', 'text', 'background', 'nextSceneId', 'onFailSceneId', 'onPassSceneId'].includes(key) && (definition.enum || ['string', 'number', 'integer', 'boolean'].includes(definition.type)))
  return <details className="mt-4"><summary className="cursor-pointer text-sm font-semibold">Trường bổ sung theo schema máy chủ</summary>
    {schema?.schemaVersion && <p className="my-2 text-xs text-slate-500">Schema phiên bản {schema.schemaVersion}</p>}
    {!fields.length && <p className="my-2 text-xs text-slate-500">Các cấu trúc lồng nhau có thể chỉnh sửa trong chế độ JSON. Schema đầy đủ nằm bên dưới.</p>}
    <fieldset disabled={disabled} className="mt-3 grid gap-3">{fields.map(([key, definition]) => <label className="text-xs" key={key}>{definition.title || key}
      {definition.enum ? <select className={`${inputCls} w-full`} value={scene[key] ?? ''} onChange={event => update({ [key]: event.target.value })}><option value="">Chọn giá trị</option>{definition.enum.map(value => <option value={value} key={value}>{String(value)}</option>)}</select>
        : definition.type === 'boolean' ? <input type="checkbox" checked={!!scene[key]} onChange={event => update({ [key]: event.target.checked })} />
          : <input className={`${inputCls} w-full`} type={definition.type === 'string' ? 'text' : 'number'} value={scene[key] ?? ''} onChange={event => update({ [key]: definition.type === 'string' ? event.target.value : event.target.value === '' ? null : Number(event.target.value) })} />}
      {definition.description && <small>{definition.description}</small>}
    </label>)}</fieldset>
    <details className="my-3"><summary className="cursor-pointer text-xs">Xem JSON schema</summary><pre className="max-h-80 overflow-auto whitespace-pre-wrap text-xs">{JSON.stringify(schema, null, 2)}</pre></details>
  </details>
}
