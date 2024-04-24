package org.lsedlanic.phonebook.entities;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QContact is a Querydsl query type for Contact
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QContact extends EntityPathBase<Contact> {

    private static final long serialVersionUID = -275119595L;

    public static final QContact contact = new QContact("contact");

    public final StringPath address = createString("address");

    public final StringPath city = createString("city");

    public final StringPath firstName = createString("firstName");

    public final StringPath id = createString("id");

    public final ArrayPath<byte[], Byte> image = createArray("image", byte[].class);

    public final StringPath lastName = createString("lastName");

    public final StringPath oib = createString("oib");

    public final StringPath phoneNumber = createString("phoneNumber");

    public QContact(String variable) {
        super(Contact.class, forVariable(variable));
    }

    public QContact(Path<? extends Contact> path) {
        super(path.getType(), path.getMetadata());
    }

    public QContact(PathMetadata metadata) {
        super(Contact.class, metadata);
    }

}

