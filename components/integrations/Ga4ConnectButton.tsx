"use client"

export function Ga4ConnectButton() {
  const handleConnect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/client/integrations/google/ga4/connect`
  }

  return (
    <button onClick={handleConnect} className="btn btn-primary">
      Grant Google Analytics 4 Access
    </button>
  )
}
