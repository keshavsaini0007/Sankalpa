const SkeletonTaskCard = () => (
  <>
    <style>{`
      @keyframes skeletonShimmer {
        0%   { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      .skel-line {
        border-radius: 6px;
        background: linear-gradient(
          90deg,
          rgba(255,255,255,0.04) 25%,
          rgba(124,58,237,0.08) 50%,
          rgba(255,255,255,0.04) 75%
        );
        background-size: 800px 100%;
        animation: skeletonShimmer 1.8s ease-in-out infinite;
      }
      .skel-card {
        position: relative;
        overflow: hidden;
      }
      .skel-card::before {
        content: '';
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 3px;
        border-radius: 3px 0 0 3px;
        background: linear-gradient(180deg, rgba(124,58,237,0.2), rgba(79,70,229,0.1));
      }
    `}</style>
    <div
      className="skel-card rounded-xl p-4 pl-5"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="skel-line h-4.5 w-3/4" />
          <div className="skel-line h-3 w-full" />
          <div className="skel-line h-3 w-2/3" style={{ animationDelay: '0.1s' }} />
          <div className="mt-3 flex items-center gap-3">
            <div className="skel-line h-5 w-20 rounded-full" style={{ animationDelay: '0.15s' }} />
            <div className="skel-line h-3 w-24" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
        <div className="flex gap-1 pt-0.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="skel-line h-7 w-7 rounded-lg" style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      </div>
    </div>
  </>
)

export default SkeletonTaskCard