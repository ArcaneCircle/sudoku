interface ModeProps {
  onClickMode: () => void
}

/**
 * React component for the Mistakes Mode / Fast Mode
 * elements in the Status Section.
 */
export const Mode = (props: ModeProps) => {
  return (
    <div className={'status__action-fast-mode'}>
      <label className={'status__action-fast-mode-switch'}>
        <input type="checkbox" />
        <span className={'status__action-fast-mode-slider'}
          onClick={props.onClickMode}
        ></span>
      </label>
      <p className="status__action-text">Fast Mode</p>
    </div>
  )
}
