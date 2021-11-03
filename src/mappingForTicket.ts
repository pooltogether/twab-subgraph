import { store } from "@graphprotocol/graph-ts"
import { Delegated, NewUserTwab, Ticket} from "../generated/Ticket/Ticket"
import { Account } from "../generated/schema"
import { loadOrCreateAccount } from "./helpers/loadOrCreateAccount"
import { generateCompositeId, ZERO } from "./helpers/common"
import { createTwab } from "./helpers/createTwab"

export function handleNewUserTwab(event: NewUserTwab): void {

    // load Account entity for the to address
    const delegate = event.params.delegate
    const ticketAddress = event.address.toHexString()
    const timestamp = event.block.timestamp

    const delegateAccount = loadOrCreateAccount(delegate.toHexString())
    
    // if just created set ticket field
    if(delegateAccount.ticket == null){
        delegateAccount.ticket = ticketAddress
    } 
    
    // bind to Ticket and get the balanceOf (this is the amount being Delegated)
    const ticketContract = Ticket.bind(event.address)
    const delegateAccountDetails = ticketContract.getAccountDetails(delegate) // rpc call to get the account details of the delegate

    // update the balance of the delegate
    delegateAccount.delegateBalance = delegateAccount.delegateBalance.minus(delegateAccountDetails.balance)

    // if the balance is 0 set zeroBalanceOccurredAt
    if(delegateAccount.delegateBalance.equals(ZERO)){
        delegateAccount.zeroBalanceOccurredAt = event.block.timestamp
    }

    // create twab 
    let twab = createTwab(generateCompositeId(delegate.toHexString(), timestamp.toHexString()))
    twab.timestamp = timestamp
    twab.amount = delegateAccountDetails.balance
    twab.account = delegateAccount.id
    twab.save()
    
    // assign twab to delegateAccount
    let existingDelegateTwabs = delegateAccount.twabs
    existingDelegateTwabs.push(twab.id)
    delegateAccount.twabs = existingDelegateTwabs


    // save the accounts
    delegateAccount.save()
}
