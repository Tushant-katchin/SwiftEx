import { Button } from '@mui/material'

export const OnScreenNotification = ({ notification, setNotification }) => {
  const onProceed = () => {
    window.open(notification.paymentUrl, '_blank', 'noreferrer')
    return setNotification(null)
  }

  return (
    notification && (
      <div className="container border border-success m-2 p-3 text-center">
        <h3>Your Bid is Accepted!</h3>
        <p>
          Your bid for {notification.amount} {notification.assetName} at{' '}
          {notification.pricePerUnit} price per unit is accepted.
        </p>
        <Button onClick={onProceed}>Proceed Payment</Button>
      </div>
    )
  )
}
