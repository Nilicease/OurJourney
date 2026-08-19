function Road({Jeepney}: {Jeepney: React.ComponentType | null}) {
    return (
        <div className="road">
            <div className="road-line"></div>
            {Jeepney && <Jeepney />}
        </div>
    )
}

export default Road;