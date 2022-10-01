// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

library Pairing {
    uint256 constant PRIME_Q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    struct G1Point {
        uint256 X;
        uint256 Y;
    }

    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint256[2] X;
        uint256[2] Y;
    }

    /*
     * @return The negation of p, i.e. p.plus(p.negate()) should be zero
     */
    function negate(G1Point memory p) internal pure returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        if (p.X == 0 && p.Y == 0) {
            return G1Point(0, 0);
        } else {
            return G1Point(p.X, PRIME_Q - (p.Y % PRIME_Q));
        }
    }

    /*
     * @return r the sum of two points of G1
     */
    function plus(
        G1Point memory p1,
        G1Point memory p2
    ) internal view returns (G1Point memory r) {
        uint256[4] memory input = [
            p1.X, p1.Y,
            p2.X, p2.Y
        ];
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success, "pairing-add-failed");
    }

    /*
     * @return r the product of a point on G1 and a scalar, i.e.
     *         p == p.scalarMul(1) and p.plus(p) == p.scalarMul(2) for all
     *         points p.
     */
    function scalarMul(G1Point memory p, uint256 s) internal view returns (G1Point memory r) {
        uint256[3] memory input = [p.X, p.Y, s];
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success, "pairing-mul-failed");
    }

    /* @return The result of computing the pairing check
     *         e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
     *         For example,
     *         pairing([P1(), P1().negate()], [P2(), P2()]) should return true.
     */
    function pairing(
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2,
        G1Point memory c1,
        G2Point memory c2,
        G1Point memory d1,
        G2Point memory d2
    ) internal view returns (bool) {
        uint256[24] memory input = [
            a1.X, a1.Y, a2.X[0], a2.X[1], a2.Y[0], a2.Y[1],
            b1.X, b1.Y, b2.X[0], b2.X[1], b2.Y[0], b2.Y[1],
            c1.X, c1.Y, c2.X[0], c2.X[1], c2.Y[0], c2.Y[1],
            d1.X, d1.Y, d2.X[0], d2.X[1], d2.Y[0], d2.Y[1]
        ];
        uint256[1] memory out;
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 8, input, mul(24, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success, "pairing-opcode-failed");
        return out[0] != 0;
    }
}

contract Verifier {
    uint256 constant SNARK_SCALAR_FIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    uint256 constant PRIME_Q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
    using Pairing for *;

    struct VerifyingKey {
        Pairing.G1Point alfa1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[7] IC;
    }

    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(uint256(18539181949409776187766274324927896914048164506947129798672488675199631387965), uint256(20576308065505391657339807504192120640858537277716229165529170594440081289104));
        vk.beta2 = Pairing.G2Point([uint256(11417289184086874182580308191283400329641691187102348054404019744361381301873), uint256(6116724747256041366838347463346676830830894761902181143918271377233092975323)], [uint256(3530227777708675773349523081565763761942222384344729396820470419454581940852), uint256(17882004229259591555689832334588860685987721501917713397485484180316560392440)]);
        vk.gamma2 = Pairing.G2Point([uint256(10681238220002649850775731242891004565390273282464250531436099318540476939740), uint256(17975832686179951163578751071657156935042544536425593443700078067023095322544)], [uint256(21659320431427607003534813729986363703209286785400524612183127329841002968122), uint256(20987787147735337942084479073541138056998676791576928123571901934327493972274)]);
        vk.delta2 = Pairing.G2Point([uint256(4730771961473638003427130306322759610602394948694728057382143708000740171379), uint256(17576644332856795367386108783911658626754632813280182924907729087515937631409)], [uint256(7603486203788538299928509821976175570450759538145561140702858824957801078297), uint256(11174874867701898645251427925061643191423234494065404571531108067693550701218)]);
        vk.IC[0] = Pairing.G1Point(uint256(15431641115157142706093172256087497898918820228467734421265251260459127524468), uint256(9679398067003886826247411405842962439729554641525930654586325604535670025863));
        vk.IC[1] = Pairing.G1Point(uint256(15002187431076449677617761001773037185591783298825975710737098040649376587892), uint256(11419569966679556744629138200882540603645848570911270911653024973377545016127));
        vk.IC[2] = Pairing.G1Point(uint256(14252636507002172954713937365617047258365328549146069580093815987796798377114), uint256(13743464148781684615344040222909719014296936528732797326251229150175058791328));
        vk.IC[3] = Pairing.G1Point(uint256(1817974963688706324979649303962574436379227106410265716965754570814728940403), uint256(20363412705694971409057659135870916250011582006407917714419134011529028211223));
        vk.IC[4] = Pairing.G1Point(uint256(6740338699919502437578163857215359240459310567606043831083135762117124076114), uint256(16845108937004687125465531710345767991613255181509528381496554127008213841393));
        vk.IC[5] = Pairing.G1Point(uint256(13563108940386800452018767953639962701532269813378299373091398921091116150255), uint256(4935334075724857163725719095577874832598955987218532529055620843589732852157));
        vk.IC[6] = Pairing.G1Point(uint256(6820635646490170072917182625772229934230127086494293937349848569707308140922), uint256(17587115194863600069783490052913709344341621278831287851788320947851910975889));

    }

    /*
     * @returns Whether the proof is valid given the hardcoded verifying key
     *          above and the public inputs
     */
    function verifyProof(
        bytes memory proof,
        uint256[6] memory input
    ) public view returns (bool) {
        uint256[8] memory p = abi.decode(proof, (uint256[8]));
        for (uint8 i = 0; i < p.length; i++) {
            // Make sure that each element in the proof is less than the prime q
            require(p[i] < PRIME_Q, "verifier-proof-element-gte-prime-q");
        }
        Pairing.G1Point memory proofA = Pairing.G1Point(p[0], p[1]);
        Pairing.G2Point memory proofB = Pairing.G2Point([p[2], p[3]], [p[4], p[5]]);
        Pairing.G1Point memory proofC = Pairing.G1Point(p[6], p[7]);

        VerifyingKey memory vk = verifyingKey();
        // Compute the linear combination vkX
        Pairing.G1Point memory vkX = vk.IC[0];
        for (uint256 i = 0; i < input.length; i++) {
            // Make sure that every input is less than the snark scalar field
            require(input[i] < SNARK_SCALAR_FIELD, "verifier-input-gte-snark-scalar-field");
            vkX = Pairing.plus(vkX, Pairing.scalarMul(vk.IC[i + 1], input[i]));
        }

        return Pairing.pairing(
            Pairing.negate(proofA),
            proofB,
            vk.alfa1,
            vk.beta2,
            vkX,
            vk.gamma2,
            proofC,
            vk.delta2
        );
    }
}

