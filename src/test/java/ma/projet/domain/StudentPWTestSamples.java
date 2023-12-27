package ma.projet.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class StudentPWTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static StudentPW getStudentPWSample1() {
        return new StudentPW()
            .id(1L)
            .time("time1")
            .mesureAngle1("mesureAngle11")
            .mesureAngle2("mesureAngle21")
            .intersection("intersection1");
    }

    public static StudentPW getStudentPWSample2() {
        return new StudentPW()
            .id(2L)
            .time("time2")
            .mesureAngle1("mesureAngle12")
            .mesureAngle2("mesureAngle22")
            .intersection("intersection2");
    }

    public static StudentPW getStudentPWRandomSampleGenerator() {
        return new StudentPW()
            .id(longCount.incrementAndGet())
            .time(UUID.randomUUID().toString())
            .mesureAngle1(UUID.randomUUID().toString())
            .mesureAngle2(UUID.randomUUID().toString())
            .intersection(UUID.randomUUID().toString());
    }
}
