type = """
scalar JSON
type testText {
    success:Boolean!
    errors:[String]
    message:String
}
type ApplicantInfo {
  businessName: String
  address: String
  contactDetails: String
  businessType: String
}

type InsuranceCoverage {
  coverageType: String
  coverageAmount: Float
}

type BusinessOperation {
  description: String
  locations: [String]
  additionalInsured: [String]
}

type PriorInsurance {
  policyNumber: String
  insurer: String
  coverageType: String
  expirationDate: String
  claimsMade: [String]
}

type LossHistory {
  date: String
  description: String
  amountPaid: Float
}

type Signatures {
  applicantSignature: String
  date: String
  agentSignature: String
}

type ACORD125Form {
  applicantInfo: ApplicantInfo
  insuranceCoverages: [InsuranceCoverage]
  businessOperations: BusinessOperation
  priorInsurance: [PriorInsurance]
  lossHistory: [LossHistory]
  signatures: Signatures
}

type ACORD125FormOutput {
    success:Boolean!
    data:JSON
    errors:[String]
}
"""
query = """
getText(text:String!):testText!
getTimeAsync:testText!
acord125Forms: ACORD125FormOutput!
"""
mutation = """
fakeMutation:Boolean!
"""
tests = {
    "type":type,
    "query":query,
    "mutation":mutation
}