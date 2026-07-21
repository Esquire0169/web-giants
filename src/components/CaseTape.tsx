import type { CaseBase } from '../data/cases'
import { useLocale } from '../i18n'

export function caseStatusLabel(
  c: Pick<CaseBase, 'status' | 'eta'>,
  status: ReturnType<typeof useLocale>['t']['work']['status'],
) {
  if (c.status === 'live') return status.live
  if (c.status === 'refine') return status.refine
  if (!c.eta) return status.wip
  return status.wipWithEta.replace('{eta}', status.eta[c.eta])
}

export function CaseTape({
  status,
  eta,
}: {
  status: CaseBase['status']
  eta?: CaseBase['eta']
}) {
  const { t } = useLocale()
  const label = caseStatusLabel({ status, eta }, t.work.status)
  const tapeKind = status === 'live' ? 'live' : 'wip'

  return (
    <div
      className={`case-tape case-tape--${tapeKind}`}
      aria-label={label}
    >
      <span className="case-tape__label">{label}</span>
    </div>
  )
}
