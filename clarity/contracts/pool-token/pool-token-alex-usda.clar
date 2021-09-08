(impl-trait .trait-pool-token.pool-token-trait)

(define-fungible-token alex-usda)

(define-data-var token-uri (string-utf8 256) u"")
(define-data-var contract-owner principal tx-sender)

;; errors
(define-constant not-authorized-err u1000)


(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (match (ft-transfer? alex-usda amount sender recipient)
    response (begin
      (print memo)
      (ok response)
    )
    error (err error)
  )
)

(define-read-only (get-name)
  (ok "ALEX V1 galex USDA LP Token")
)

(define-read-only (get-symbol)
  (ok "ALEXV1GALEXUSDA")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (owner principal))
  (ok (ft-get-balance alex-usda owner))
)

(define-read-only (get-expiry)
  (ok 438000000000)
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply alex-usda))
)

(define-read-only (get-token-uri)
  (ok (some u"https://docs.alexgo.io/"))
)


;; one stop function to gather all the data relevant to the LP token in one call
(define-read-only (get-data (owner principal))
  (ok {
    name: (unwrap-panic (get-name)),
    symbol: (unwrap-panic (get-symbol)),
    decimals: (unwrap-panic (get-decimals)),
    uri: (unwrap-panic (get-token-uri)),
    supply: (unwrap-panic (get-total-supply)),
    balance: (unwrap-panic (get-balance owner))
  })
)

;; the extra mint method used when adding liquidity
;; can only be used by arkadiko swap main contract
(define-public (mint (recipient principal) (amount uint))
  (begin
    (print "alex-token-swap.mint")
    (print contract-caller)
    (print amount)
    ;; TODO - make dynamic
    ;; (asserts! (is-eq contract-caller .arkadiko-swap-v1-1) (err not-authorized-err))
    (ft-mint? alex-usda amount recipient)
  )
)


;; the extra burn method used when removing liquidity
;; can only be used by arkadiko swap main contract
(define-public (burn (recipient principal) (amount uint))
  (begin
    (print "alex-token-swap.burn")
    (print contract-caller)
    (print amount)
    ;; TODO - make dynamic
    ;; (asserts! (is-eq contract-caller .arkadiko-swap-v1-1) (err not-authorized-err))
    (ft-burn? alex-usda amount recipient)
  )
)

;; (begin
;;   ;; TODO: Erase on testnet or mainnet
;;   (try! (ft-mint? alex-usda u10000000000 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE)) ;; Deployer
;;   (try! (ft-mint? alex-usda u10000000000 'ST1J4G6RR643BCG8G8SR6M2D9Z9KXT2NJDRK3FBTK)) ;; Wallet 1
;; )