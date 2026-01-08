# Herbal Traceability Blockchain Backend

This backend system is developed to support a blockchain based herbal traceability platform  
It ensures transparency authenticity and trust across the Ayurvedic herbal supply chain  
The backend acts as the core system for managing data workflows and blockchain records  

## Project Purpose

To securely register farmers and manage their data  
To track herb batches from origin to final consumer  
To prevent data tampering using blockchain technology  
To enable verification by authorities and laboratories  
To provide transparent traceability for consumers  

## Backend Responsibilities

Handles farmer onboarding and profile management  
Stores herb batch details and lifecycle information  
Manages verifier and laboratory approval workflows  
Commits verified data to the blockchain ledger  
Exposes secure APIs for web mobile and IVR systems  

## Blockchain Integration

Uses a permissioned blockchain network  
Stores immutable records of verified herb batches  
Prevents alteration of approved supply chain data  
Links each batch to a unique traceability identifier  
Supports QR based consumer verification  

## Technology Stack

Node.js for backend runtime environment  
Express.js for API development  
Hyperledger Fabric for blockchain implementation  
MongoDB for off chain data storage  
REST APIs for system communication  
Environment based configuration for security  

## Backend Architecture

Modular architecture for scalability  
Controllers handle business logic  
Routes define API endpoints  
Services manage blockchain interactions  
Models define database schemas  
Middleware handles authentication and validation  

## Core Backend Features

Secure farmer registration system  
Herb batch creation and management  
Verification and laboratory approval flows  
Blockchain ledger commit functionality  
Role based access control  
QR traceability data support  
API level data validation and security  

## Data Flow Process

Farmer data is registered and stored in database  
Herb batches are created and submitted for verification  
Verifiers and labs review and approve data  
Approved batch data is written to blockchain  
Unique traceability reference is generated  
Consumer systems retrieve verified data using QR  

## API Usage

Farmer registration and onboarding APIs  
Herb batch creation and tracking APIs  
Verifier and laboratory action APIs  
Blockchain commit APIs  
Traceability query APIs  

## Security Measures

Environment variables used for sensitive data  
Role based authorization enforced  
Request validation middleware implemented  
Blockchain ensures tamper proof records  

## Real World Use Cases

Government regulated herbal supply chains  
Regulatory audits and compliance verification  
Farmer empowerment through authenticity protection  
Consumer trust through transparent product history  

## Development Status

Core backend functionality implemented  
System is actively evolving  
Optimizations and reporting features planned  

## Conclusion

This backend demonstrates real world blockchain application  
It showcases secure backend architecture and workflow design  
It supports scalable decentralized supply chain solutions  
It is suitable for hackathons production systems and evaluation platforms  
