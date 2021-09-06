(impl-trait .trait-sip-010.sip-010-trait)
(impl-trait .trait-yield-token.yield-token-trait) 

;; Defines ayUSDA which conforms sip010-trait and yield-token-trait. 
;; yield-usda-wbtc with expiry of one month

(define-fungible-token yield-usda-59760)

(define-data-var token-uri (string-utf8 256) u"")
(define-data-var token-expiry uint u5976000000000)  
(define-data-var underlying-token principal .token-usda)

;; errors
(define-constant err-not-authorized u1000)

;; ---------------------------------------------------------
;; SIP-10 Functions
;; ---------------------------------------------------------

(define-read-only (get-name)
  (ok "yield-usda-59760")
)

(define-read-only (get-symbol)
  (ok "yield-usda-59760")
)

(define-read-only (get-decimals)
  (ok u8)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance yield-usda-59760 account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply yield-usda-59760))
)

(define-public (set-token-uri (value (string-utf8 256)))
  ;; TODO : Authorization Check
  ;;(if (is-eq tx-sender (contract-call? .OWNER))
    (ok (var-set token-uri value))
  ;;  (err ERR-NOT-AUTHORIZED)
  ;;)
)

(define-read-only (get-token-uri)
  (ok (some (var-get token-uri)))
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (match (ft-transfer? yield-usda-59760 amount sender recipient)
    response (begin
      (print memo)
      (ok response)
    )
    error (err error)
  )
)

;; ---------------------------------------------------------
;; ayUSDA token trait
;; ---------------------------------------------------------

;; Mint method for yield-usda-59760
(define-public (mint (recipient principal) (amount uint))
  (begin
    ;;(asserts! (is-eq contract-caller .yield-usda-pool) (err err-not-authorized))
    (ft-mint? yield-usda-59760 amount recipient)
  )
)

;; Burn method for yield-usda-59760
(define-public (burn (sender principal) (amount uint))
  (begin
    ;;(asserts! (is-eq contract-caller .yield-usda-pool) (err err-not-authorized))
    (ft-burn? yield-usda-59760 amount sender)
  )
)

(define-public (get-token)
    (ok (var-get underlying-token))
)

(define-public (get-expiry)
    (ok (var-get token-expiry))
)


;; Initialize the contract for Testing.
(begin
  ;; TODO: Erase on testnet or mainnet
  (try! (ft-mint? yield-usda-59760 u1000000000000 'ST1RKT6V51K1G3DXWZC22NX6PFM6GBZ8FQKSGSNFY)) ;; RegTest-V2 Deployer
  ;;(try! (ft-mint? yield-usda-59760 u1000000000000 'ST1RKT6V51K1G3DXWZC22NX6PFM6GBZ8FQKSGSNFY)) ;; Wallet 2
)